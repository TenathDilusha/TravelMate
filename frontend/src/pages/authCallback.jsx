import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthCallback() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    refreshUser()
      .then((user) => {
        if (cancelled) return;
        if (!user) {
          setError("No active session cookie. Please try signing in again.");
          return;
        }
        navigate("/discover", { replace: true });
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not complete login.");
      });

    return () => {
      cancelled = true;
    };
  }, [refreshUser, navigate]);

  if (error) {
    return (
      <div className="login-page">
        <div className="container">
          <div className="login-card">
            <h1>Sign-in failed</h1>
            <div className="login-error" role="alert">{error}</div>
            <Link to="/login" className="oauth-button oauth-github">
              Try again
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-card login-card-loading">
          <div className="discover-loader">
            <div className="loader-dot" />
            <div className="loader-dot" />
            <div className="loader-dot" />
          </div>
          <p>Finishing sign-in…</p>
        </div>
      </div>
    </div>
  );
}
