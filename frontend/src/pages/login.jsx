import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OAuthButtons from "../components/OAuthButtons";

export default function Login() {
  const { isAuthenticated, loading, loginWithPassword, registerWithPassword } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const initialRegister =
    params.get("view") === "register" || /not registered/i.test(params.get("error") || "");

  const [showRegister, setShowRegister] = useState(initialRegister);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(params.get("error") || "");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to="/discover" replace />;
  }

  const openRegister = () => {
    setError("");
    setShowRegister(true);
    navigate("/login?view=register", { replace: true });
  };

  const openLogin = () => {
    setError("");
    setShowRegister(false);
    navigate("/login", { replace: true });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await loginWithPassword({ email: email.trim(), password });
      navigate("/discover", { replace: true });
    } catch (err) {
      const message = err.message || "Could not sign in.";
      if (err.status === 404 || /not registered/i.test(message)) {
        setError(message);
        setShowRegister(true);
        navigate(`/login?view=register&error=${encodeURIComponent(message)}`, { replace: true });
        return;
      }
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await registerWithPassword({
        username: username.trim(),
        email: email.trim(),
        password,
      });
      navigate("/discover", { replace: true });
    } catch (err) {
      setError(err.message || "Could not create account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-hero-bg" />
      <div className="login-shell">
        <div className={`login-card ${showRegister ? "is-register" : ""}`}>
          <div className="login-brand">
            <h1>{showRegister ? "Register" : "Sign in"}</h1>
            <p>
              {showRegister
                ? "Username + email, or a provider below."
                : "Use your email and password."}
            </p>
          </div>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          {!showRegister ? (
            <>
              <form className="auth-form" onSubmit={handleLogin}>
                <div className="auth-grid-2">
                  <div className="auth-field">
                    <label htmlFor="login-email">Email</label>
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="auth-field">
                    <label htmlFor="login-password">Password</label>
                    <input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                <div className="auth-actions">
                  <button type="submit" className="auth-submit" disabled={submitting}>
                    {submitting ? "…" : "Sign in"}
                  </button>
                  <button type="button" className="auth-secondary" onClick={openRegister}>
                    Register
                  </button>
                </div>
              </form>

              <div className="login-divider"><span>or continue with</span></div>

              <OAuthButtons
                compact
                actionLabel="Login"
                mode="login"
                onValidationError={setError}
              />

              <p className="login-home-link">
                <Link to="/">Back to home</Link>
              </p>
            </>
          ) : (
            <>
              <form className="auth-form" onSubmit={handleRegister}>
                <div className="auth-field">
                  <label htmlFor="register-username">Username</label>
                  <input
                    id="register-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="travel_explorer"
                    required
                    minLength={3}
                    maxLength={32}
                    pattern="[A-Za-z0-9_]+"
                    autoComplete="username"
                  />
                </div>

                <div className="auth-grid-2">
                  <div className="auth-field">
                    <label htmlFor="register-email">Email</label>
                    <input
                      id="register-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="auth-field">
                    <label htmlFor="register-password">Password</label>
                    <input
                      id="register-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <div className="auth-field">
                  <label htmlFor="register-confirm">Confirm password</label>
                  <input
                    id="register-confirm"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>

                <button type="submit" className="auth-submit" disabled={submitting}>
                  {submitting ? "…" : "Register with email"}
                </button>
              </form>

              <div className="login-divider"><span>or</span></div>

              <OAuthButtons
                compact
                actionLabel="Register"
                mode="register"
                username={username}
                onValidationError={setError}
              />

              <button type="button" className="auth-secondary" onClick={openLogin}>
                Back to sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
