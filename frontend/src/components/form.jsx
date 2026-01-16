import { useState } from "react";

export default function RecommendationForm({ onSubmit, loading }) {
  const [preferences, setPreferences] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!preferences.trim()) return;
    onSubmit(preferences);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="input-wrapper">
        <input
          type="text"
          placeholder="e.g., beaches, mountains, historical sites, adventure..."
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          className="input-box"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Searching...
            </>
          ) : (
            <>
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              Get Recommendations
            </>
          )}
        </button>
      </div>
    </form>
  );
}
