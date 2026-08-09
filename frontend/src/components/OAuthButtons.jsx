import { useAuth } from "../context/AuthContext";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.4 12 2.4 6.9 2.4 2.7 6.6 2.7 11.7S6.9 21 12 21c5.1 0 8.5-3.6 8.5-8.6 0-.6-.1-1-.2-1.5H12z" />
      <path fill="#34A853" d="M3.9 14.5l3.2-2.3C7.9 14.8 9.8 16 12 16c1.5 0 2.6-.5 3.4-1.3l3.2 2.5C17.1 18.8 14.8 20 12 20c-3.5 0-6.5-2.2-8.1-5.5z" />
      <path fill="#4A90E2" d="M20.5 11.4c0-.6-.1-1-.2-1.5H12v3.9h5.5c-.3 1.1-.9 2-1.8 2.6l3.2 2.5c1.9-1.8 2.6-4.4 2.6-7.5z" />
      <path fill="#FBBC05" d="M7.1 12.2c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9L3.9 5.9C3.1 7.5 2.7 9.3 2.7 11.3c0 2 .4 3.8 1.2 5.4l3.2-2.5z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#1877F2" d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.4V9.84c0-2.37 1.4-3.68 3.56-3.68 1.03 0 2.11.18 2.11.18v2.33h-1.19c-1.17 0-1.54.73-1.54 1.48v1.78h2.62l-.42 2.91h-2.2V22c4.78-.75 8.44-4.91 8.44-9.93z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="#24292F">
      <path d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.9 9.6.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.4-3.4-1.4-.5-1.1-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.2-4.6-5.1 0-1.1.4-2.1 1-2.8-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1.1.8-.2 1.6-.3 2.4-.3s1.6.1 2.4.3c2-.1.8 1.1.8 1.1.5 1.4.2 2.4.1 2.7.6.7 1 1.7 1 2.8 0 3.9-2.4 4.8-4.6 5.1.4.3.7 1 .7 2v2.9c0 .3.2.6.7.5 4-1.3 6.9-5.1 6.9-9.6C22 6.6 17.5 2 12 2z" />
    </svg>
  );
}

const PROVIDERS = [
  { id: "google", label: "Google", Icon: GoogleIcon },
  { id: "facebook", label: "Facebook", Icon: FacebookIcon },
  { id: "github", label: "GitHub", Icon: GitHubIcon },
];

export default function OAuthButtons({
  actionLabel = "Login",
  mode = "login",
  username = "",
  onValidationError,
  compact = false,
}) {
  const { providers, startOAuth } = useAuth();

  const handleClick = (provider, enabled) => {
    if (!enabled) {
      onValidationError?.(
        `${provider[0].toUpperCase()}${provider.slice(1)} is not configured on the server.`
      );
      return;
    }
    if (mode === "register" && !username.trim()) {
      onValidationError?.("Enter a username before using a provider.");
      return;
    }
    startOAuth(provider, { mode, username: username.trim() });
  };

  return (
    <div className="oauth-panel">
      <div className={`oauth-grid ${compact ? "oauth-grid-compact" : ""}`}>
        {PROVIDERS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className={`oauth-chip oauth-${id}`}
            onClick={() => handleClick(id, providers[id])}
            title={`${actionLabel} with ${label}`}
            aria-label={`${actionLabel} with ${label}`}
          >
            <span className="oauth-chip-icon">
              <Icon />
            </span>
            <span className="oauth-chip-label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
