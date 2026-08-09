"""Email/password + Google/GitHub/Facebook OAuth with httpOnly session cookies."""

import os
import re
import time
from typing import Optional
from urllib.parse import quote, urlencode

import bcrypt
import httpx
import jwt
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import JSONResponse, RedirectResponse
from pydantic import BaseModel, EmailStr, Field

from details import get_db_connection

router = APIRouter(prefix="/auth", tags=["auth"])

SESSION_COOKIE = "travelmate_session"
PENDING_MODE_COOKIE = "travelmate_oauth_mode"
PENDING_USERNAME_COOKIE = "travelmate_pending_username"
SESSION_MAX_AGE = 60 * 60 * 24 * 7

USERS_DDL = """
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255),
  email VARCHAR(255),
  password_hash TEXT,
  provider VARCHAR(50) NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (provider, provider_id)
);
"""

USERNAME_RE = re.compile(r"^[a-zA-Z0-9_]{3,32}$")


class RegisterBody(BaseModel):
    username: str = Field(min_length=3, max_length=32)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class LoginBody(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


def _env(name: str, default: str = "") -> str:
    return (os.getenv(name) or default).strip()


def frontend_url() -> str:
    return _env("FRONTEND_URL", "http://localhost:5173").rstrip("/")


def backend_url() -> str:
    return _env("BACKEND_URL", "http://localhost:8000").rstrip("/")


def jwt_secret() -> str:
    secret = _env("JWT_SECRET")
    if not secret:
        raise HTTPException(
            status_code=500,
            detail="JWT_SECRET is not configured on the server",
        )
    return secret


def cookie_secure() -> bool:
    return _env("COOKIE_SECURE", "false").lower() in ("1", "true", "yes")


def cookie_samesite() -> str:
    value = _env("COOKIE_SAMESITE", "lax").lower()
    if value not in ("lax", "strict", "none"):
        return "lax"
    return value


def ensure_users_table():
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(USERS_DDL)
        cur.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255);")
        cur.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;")
        cur.execute(
            """
            CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower_idx
            ON users (LOWER(username))
            WHERE username IS NOT NULL;
            """
        )
        cur.execute(
            """
            CREATE UNIQUE INDEX IF NOT EXISTS users_local_email_lower_idx
            ON users (LOWER(email))
            WHERE provider = 'local' AND email IS NOT NULL;
            """
        )
        conn.commit()
    finally:
        cur.close()
        conn.close()


def _row_to_user(row) -> dict:
    return {
        "id": row[0],
        "username": row[1],
        "email": row[2],
        "provider": row[3],
        "provider_id": row[4],
        "name": row[5],
        "avatar_url": row[6],
        "created_at": row[7].isoformat() if row[7] else None,
    }


USER_SELECT = """
SELECT id, username, email, provider, provider_id, name, avatar_url, created_at
FROM users
"""


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except ValueError:
        return False


def validate_username(username: str) -> str:
    cleaned = (username or "").strip()
    if not USERNAME_RE.match(cleaned):
        raise HTTPException(
            status_code=400,
            detail="Username must be 3–32 characters (letters, numbers, underscore).",
        )
    return cleaned


def find_user_by_provider(provider: str, provider_id: str) -> Optional[dict]:
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            USER_SELECT + " WHERE provider = %s AND provider_id = %s LIMIT 1;",
            (provider, str(provider_id)),
        )
        row = cur.fetchone()
        return _row_to_user(row) if row else None
    finally:
        cur.close()
        conn.close()


def find_local_user_by_email(email: str) -> Optional[dict]:
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            USER_SELECT + " WHERE provider = 'local' AND LOWER(email) = LOWER(%s) LIMIT 1;",
            (email,),
        )
        row = cur.fetchone()
        return _row_to_user(row) if row else None
    finally:
        cur.close()
        conn.close()


def get_password_hash_for_user(user_id: int) -> Optional[str]:
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT password_hash FROM users WHERE id = %s;", (user_id,))
        row = cur.fetchone()
        return row[0] if row else None
    finally:
        cur.close()
        conn.close()


def create_local_user(username: str, email: str, password: str) -> dict:
    ensure_users_table()
    username = validate_username(username)
    email = email.strip().lower()
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT 1 FROM users WHERE LOWER(username) = LOWER(%s) LIMIT 1;",
            (username,),
        )
        if cur.fetchone():
            raise HTTPException(status_code=409, detail="Username is already taken.")
        cur.execute(
            """
            SELECT 1 FROM users
            WHERE provider = 'local' AND LOWER(email) = LOWER(%s)
            LIMIT 1;
            """,
            (email,),
        )
        if cur.fetchone():
            raise HTTPException(status_code=409, detail="Email is already registered. Please sign in.")

        cur.execute(
            """
            INSERT INTO users (username, email, password_hash, provider, provider_id, name)
            VALUES (%s, %s, %s, 'local', %s, %s)
            RETURNING id, username, email, provider, provider_id, name, avatar_url, created_at;
            """,
            (username, email, hash_password(password), email, username),
        )
        row = cur.fetchone()
        conn.commit()
        return _row_to_user(row)
    except HTTPException:
        conn.rollback()
        raise
    finally:
        cur.close()
        conn.close()


def create_oauth_user(
    provider: str,
    provider_id: str,
    email: Optional[str],
    name: Optional[str],
    avatar_url: Optional[str],
    username: str,
) -> dict:
    ensure_users_table()
    username = validate_username(username)
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            USER_SELECT + " WHERE provider = %s AND provider_id = %s LIMIT 1;",
            (provider, str(provider_id)),
        )
        if cur.fetchone():
            raise HTTPException(
                status_code=409,
                detail="This account is already registered. Please sign in.",
            )

        cur.execute(
            "SELECT 1 FROM users WHERE LOWER(username) = LOWER(%s) LIMIT 1;",
            (username,),
        )
        if cur.fetchone():
            raise HTTPException(status_code=409, detail="Username is already taken.")

        cur.execute(
            """
            INSERT INTO users (username, email, password_hash, provider, provider_id, name, avatar_url)
            VALUES (%s, %s, NULL, %s, %s, %s, %s)
            RETURNING id, username, email, provider, provider_id, name, avatar_url, created_at;
            """,
            (
                username,
                email,
                provider,
                str(provider_id),
                name or username,
                avatar_url,
            ),
        )
        row = cur.fetchone()
        conn.commit()
        return _row_to_user(row)
    except HTTPException:
        conn.rollback()
        raise
    finally:
        cur.close()
        conn.close()


def create_access_token(user: dict) -> str:
    payload = {
        "sub": str(user["id"]),
        "username": user.get("username"),
        "email": user.get("email"),
        "name": user.get("name") or user.get("username"),
        "avatar_url": user.get("avatar_url"),
        "provider": user.get("provider"),
        "exp": int(time.time()) + SESSION_MAX_AGE,
    }
    return jwt.encode(payload, jwt_secret(), algorithm="HS256")


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, jwt_secret(), algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired session")


def user_from_payload(payload: dict) -> dict:
    return {
        "id": int(payload["sub"]),
        "username": payload.get("username"),
        "email": payload.get("email"),
        "name": payload.get("name"),
        "avatar_url": payload.get("avatar_url"),
        "provider": payload.get("provider"),
    }


def set_session_cookie(response: Response, token: str) -> None:
    samesite = cookie_samesite()
    secure = cookie_secure() or samesite == "none"
    response.set_cookie(
        key=SESSION_COOKIE,
        value=token,
        httponly=True,
        secure=secure,
        samesite=samesite,
        max_age=SESSION_MAX_AGE,
        path="/",
    )


def clear_session_cookie(response: Response) -> None:
    samesite = cookie_samesite()
    secure = cookie_secure() or samesite == "none"
    response.delete_cookie(
        key=SESSION_COOKIE,
        path="/",
        httponly=True,
        secure=secure,
        samesite=samesite,
    )


def _set_pending_oauth_cookies(response: Response, mode: str, username: str = "") -> None:
    samesite = cookie_samesite()
    secure = cookie_secure() or samesite == "none"
    response.set_cookie(
        key=PENDING_MODE_COOKIE,
        value=mode,
        httponly=True,
        secure=secure,
        samesite=samesite,
        max_age=600,
        path="/",
    )
    if username:
        response.set_cookie(
            key=PENDING_USERNAME_COOKIE,
            value=username,
            httponly=True,
            secure=secure,
            samesite=samesite,
            max_age=600,
            path="/",
        )
    else:
        response.delete_cookie(PENDING_USERNAME_COOKIE, path="/")


def _clear_pending_oauth_cookies(response: Response) -> None:
    response.delete_cookie(PENDING_MODE_COOKIE, path="/")
    response.delete_cookie(PENDING_USERNAME_COOKIE, path="/")


def get_current_user(request: Request) -> dict:
    token = request.cookies.get(SESSION_COOKIE)
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.lower().startswith("bearer "):
            token = auth.split(" ", 1)[1].strip()
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user_from_payload(decode_token(token))


def _redirect_with_session(user: dict) -> RedirectResponse:
    response = RedirectResponse(f"{frontend_url()}/auth/callback", status_code=302)
    set_session_cookie(response, create_access_token(user))
    _clear_pending_oauth_cookies(response)
    return response


def _redirect_login_error(message: str) -> RedirectResponse:
    return RedirectResponse(f"{frontend_url()}/login?error={quote(message)}")


def _redirect_register_error(message: str) -> RedirectResponse:
    return RedirectResponse(f"{frontend_url()}/register?error={quote(message)}")


def _finish_oauth(
    request: Request,
    provider: str,
    provider_id: str,
    email: Optional[str],
    name: Optional[str],
    avatar_url: Optional[str],
):
    mode = request.cookies.get(PENDING_MODE_COOKIE, "login")
    username = (request.cookies.get(PENDING_USERNAME_COOKIE) or "").strip()

    if mode == "register":
        if not username:
            return _redirect_register_error("Username is required before registering with a provider.")
        try:
            user = create_oauth_user(provider, provider_id, email, name, avatar_url, username)
        except HTTPException as exc:
            return _redirect_register_error(str(exc.detail))
        return _redirect_with_session(user)

    user = find_user_by_provider(provider, provider_id)
    if not user:
        return _redirect_register_error(
            "User not registered. Please create an account first."
        )
    return _redirect_with_session(user)


def _start_oauth_redirect(provider_url: str, mode: str, username: str = "") -> RedirectResponse:
    mode = (mode or "login").lower()
    if mode not in ("login", "register"):
        mode = "login"
    if mode == "register":
        try:
            username = validate_username(username)
        except HTTPException as exc:
            return _redirect_register_error(str(exc.detail))
    response = RedirectResponse(provider_url, status_code=302)
    _set_pending_oauth_cookies(response, mode, username if mode == "register" else "")
    return response


@router.get("/providers")
def list_providers():
    return {
        "google": bool(_env("GOOGLE_CLIENT_ID") and _env("GOOGLE_CLIENT_SECRET")),
        "github": bool(_env("GITHUB_CLIENT_ID") and _env("GITHUB_CLIENT_SECRET")),
        "facebook": bool(_env("FACEBOOK_APP_ID") and _env("FACEBOOK_APP_SECRET")),
        "password": True,
    }


@router.post("/register")
def register(body: RegisterBody):
    user = create_local_user(body.username, str(body.email), body.password)
    response = JSONResponse({"user": user, "ok": True})
    set_session_cookie(response, create_access_token(user))
    return response


@router.post("/login")
def login(body: LoginBody):
    ensure_users_table()
    user = find_local_user_by_email(str(body.email))
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not registered. Please create an account first.",
        )
    password_hash = get_password_hash_for_user(user["id"])
    if not password_hash or not verify_password(body.password, password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password.")
    response = JSONResponse({"user": user, "ok": True})
    set_session_cookie(response, create_access_token(user))
    return response


@router.get("/google")
def google_login(mode: str = "login", username: str = ""):
    client_id = _env("GOOGLE_CLIENT_ID")
    if not client_id or not _env("GOOGLE_CLIENT_SECRET"):
        raise HTTPException(status_code=503, detail="Google OAuth is not configured")
    params = {
        "client_id": client_id,
        "redirect_uri": f"{backend_url()}/auth/google/callback",
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "online",
        "prompt": "select_account",
    }
    return _start_oauth_redirect(
        f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}",
        mode,
        username,
    )


@router.get("/google/callback")
def google_callback(
    request: Request,
    code: Optional[str] = None,
    error: Optional[str] = None,
):
    if error or not code:
        return _redirect_login_error(error or "Google login was cancelled")

    client_id = _env("GOOGLE_CLIENT_ID")
    client_secret = _env("GOOGLE_CLIENT_SECRET")
    redirect_uri = f"{backend_url()}/auth/google/callback"

    with httpx.Client(timeout=20) as client:
        token_res = client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": client_id,
                "client_secret": client_secret,
                "redirect_uri": redirect_uri,
                "grant_type": "authorization_code",
            },
        )
        if token_res.status_code != 200:
            return _redirect_login_error("Failed to exchange Google auth code")
        access_token = token_res.json().get("access_token")
        user_res = client.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        if user_res.status_code != 200:
            return _redirect_login_error("Failed to fetch Google profile")
        profile = user_res.json()

    return _finish_oauth(
        request,
        provider="google",
        provider_id=profile["sub"],
        email=profile.get("email"),
        name=profile.get("name") or profile.get("email"),
        avatar_url=profile.get("picture"),
    )


@router.get("/github")
def github_login(mode: str = "login", username: str = ""):
    client_id = _env("GITHUB_CLIENT_ID")
    if not client_id or not _env("GITHUB_CLIENT_SECRET"):
        raise HTTPException(status_code=503, detail="GitHub OAuth is not configured")
    params = {
        "client_id": client_id,
        "redirect_uri": f"{backend_url()}/auth/github/callback",
        "scope": "read:user user:email",
    }
    return _start_oauth_redirect(
        f"https://github.com/login/oauth/authorize?{urlencode(params)}",
        mode,
        username,
    )


@router.get("/github/callback")
def github_callback(
    request: Request,
    code: Optional[str] = None,
    error: Optional[str] = None,
):
    if error or not code:
        return _redirect_login_error(error or "GitHub login was cancelled")

    client_id = _env("GITHUB_CLIENT_ID")
    client_secret = _env("GITHUB_CLIENT_SECRET")

    with httpx.Client(timeout=20) as client:
        token_res = client.post(
            "https://github.com/login/oauth/access_token",
            headers={"Accept": "application/json"},
            data={
                "client_id": client_id,
                "client_secret": client_secret,
                "code": code,
                "redirect_uri": f"{backend_url()}/auth/github/callback",
            },
        )
        if token_res.status_code != 200:
            return _redirect_login_error("Failed to exchange GitHub auth code")
        access_token = token_res.json().get("access_token")
        if not access_token:
            return _redirect_login_error("GitHub did not return an access token")

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/json",
        }
        user_res = client.get("https://api.github.com/user", headers=headers)
        if user_res.status_code != 200:
            return _redirect_login_error("Failed to fetch GitHub profile")
        profile = user_res.json()

        email = profile.get("email")
        if not email:
            emails_res = client.get("https://api.github.com/user/emails", headers=headers)
            if emails_res.status_code == 200:
                emails = emails_res.json()
                primary = next((e for e in emails if e.get("primary") and e.get("verified")), None)
                email = (primary or (emails[0] if emails else {})).get("email")

    return _finish_oauth(
        request,
        provider="github",
        provider_id=str(profile["id"]),
        email=email,
        name=profile.get("name") or profile.get("login"),
        avatar_url=profile.get("avatar_url"),
    )


@router.get("/facebook")
def facebook_login(mode: str = "login", username: str = ""):
    app_id = _env("FACEBOOK_APP_ID")
    if not app_id or not _env("FACEBOOK_APP_SECRET"):
        raise HTTPException(status_code=503, detail="Facebook OAuth is not configured")
    params = {
        "client_id": app_id,
        "redirect_uri": f"{backend_url()}/auth/facebook/callback",
        "response_type": "code",
        "scope": "email,public_profile",
    }
    return _start_oauth_redirect(
        f"https://www.facebook.com/v21.0/dialog/oauth?{urlencode(params)}",
        mode,
        username,
    )


@router.get("/facebook/callback")
def facebook_callback(
    request: Request,
    code: Optional[str] = None,
    error: Optional[str] = None,
):
    if error or not code:
        return _redirect_login_error(error or "Facebook login was cancelled")

    app_id = _env("FACEBOOK_APP_ID")
    app_secret = _env("FACEBOOK_APP_SECRET")
    redirect_uri = f"{backend_url()}/auth/facebook/callback"

    with httpx.Client(timeout=20) as client:
        token_res = client.get(
            "https://graph.facebook.com/v21.0/oauth/access_token",
            params={
                "client_id": app_id,
                "client_secret": app_secret,
                "redirect_uri": redirect_uri,
                "code": code,
            },
        )
        if token_res.status_code != 200:
            return _redirect_login_error("Failed to exchange Facebook auth code")
        access_token = token_res.json().get("access_token")
        if not access_token:
            return _redirect_login_error("Facebook did not return an access token")

        user_res = client.get(
            "https://graph.facebook.com/me",
            params={
                "fields": "id,name,email,picture.type(large)",
                "access_token": access_token,
            },
        )
        if user_res.status_code != 200:
            return _redirect_login_error("Failed to fetch Facebook profile")
        profile = user_res.json()

    picture = profile.get("picture", {})
    avatar_url = picture.get("data", {}).get("url") if isinstance(picture, dict) else None

    return _finish_oauth(
        request,
        provider="facebook",
        provider_id=str(profile["id"]),
        email=profile.get("email"),
        name=profile.get("name") or profile.get("email"),
        avatar_url=avatar_url,
    )


@router.get("/me")
def me(user: dict = Depends(get_current_user)):
    return user


@router.post("/logout")
def logout():
    response = JSONResponse({"ok": True})
    clear_session_cookie(response)
    _clear_pending_oauth_cookies(response)
    return response
