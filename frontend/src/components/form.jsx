import { useState } from "react";

export default function RecommendationForm({ onSubmit }) {
  const [preferences, setPreferences] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!preferences.trim()) return;
    onSubmit(preferences);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <input
        type="text"
        placeholder="Enter what you like to visit..."
        value={preferences}
        onChange={(e) => setPreferences(e.target.value)}
        className="input-box"
      />
      <button type="submit" className="submit-button">
        Recommend
      </button>
    </form>
  );
}
