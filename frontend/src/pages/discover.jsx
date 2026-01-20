import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Discover() {
  const [preferences, setPreferences] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const suggestedTags = [
    { label: "🏖️ Beaches", value: "beaches relaxing ocean" },
    { label: "🏔️ Mountains", value: "mountains hiking nature" },
    { label: "🛕 Temples", value: "temples religious cultural" },
    { label: "🦁 Wildlife", value: "wildlife safari animals" },
    { label: "🏰 Historical", value: "historical ancient ruins" },
    { label: "💧 Waterfalls", value: "waterfalls scenic nature" },
  ];

  const cardGradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!preferences.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preferences }),
      });
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = (tagValue) => {
    setPreferences(tagValue);
  };

  const handleCardClick = (placeName) => {
    navigate(`/reviews/${encodeURIComponent(placeName)}`);
  };

  return (
    <div className="discover-page">
      <section className="discover-hero">
        <div className="discover-hero-bg"></div>
        <div className="container">
          <div className="discover-hero-content">
            <span className="discover-badge">✨ AI-Powered Recommendations</span>
            <h1 className="discover-title">Find Your Next Adventure</h1>
            <p className="discover-subtitle">
              Describe your dream vacation and let our smart system find the perfect Sri Lankan destinations for you
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="discover-search-section">
          <form onSubmit={handleSubmit} className="discover-form">
            <div className="discover-input-wrapper">
              <svg className="discover-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="What kind of experience are you looking for?"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                className="discover-input"
                disabled={loading}
              />
              <button type="submit" className="discover-button" disabled={loading}>
                {loading ? (
                  <span className="spinner"></span>
                ) : (
                  <>
                    <span>Discover</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="suggested-tags">
            <span className="tags-label">Quick search:</span>
            <div className="tags-list">
              {suggestedTags.map((tag, index) => (
                <button
                  key={index}
                  className="tag-button"
                  onClick={() => handleTagClick(tag.value)}
                  type="button"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="discover-loading">
            <div className="discover-loader">
              <div className="loader-dot"></div>
              <div className="loader-dot"></div>
              <div className="loader-dot"></div>
            </div>
            <p>Finding amazing places for you...</p>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="discover-results">
            <div className="results-header">
              <h2 className="results-heading">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
                Top Recommendations
              </h2>
              <span className="results-count">{recommendations.length} places found</span>
            </div>
            <div className="discover-grid">
              {recommendations.map((item, index) => (
                <div
                  key={index}
                  className="discover-card"
                  onClick={() => handleCardClick(item.place)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleCardClick(item.place);
                  }}
                  style={{ "--card-gradient": cardGradients[index % cardGradients.length] }}
                >
                  <div className="discover-card-number">{String(index + 1).padStart(2, '0')}</div>
                  <div className="discover-card-content">
                    <h3 className="discover-card-title">{item.place}</h3>
                  </div>
                  <div className="discover-card-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="discover-empty">
            <div className="empty-illustration">
              <svg viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="80" fill="url(#emptyGradient)" opacity="0.1"/>
                <path d="M100 50c-27.6 0-50 22.4-50 50s22.4 50 50 50 50-22.4 50-50-22.4-50-50-50zm0 90c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40z" fill="url(#emptyGradient)"/>
                <circle cx="100" cy="100" r="15" fill="url(#emptyGradient)"/>
                <defs>
                  <linearGradient id="emptyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#667eea"/>
                    <stop offset="100%" stopColor="#764ba2"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h3 className="empty-title">Ready to Explore?</h3>
            <p className="empty-text">
              Enter your preferences above or click a quick search tag to discover amazing destinations
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
