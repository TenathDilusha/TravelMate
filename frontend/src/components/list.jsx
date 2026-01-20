export default function RecommendationList({ recommendations, loading }) {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Finding the best destinations for you...</p>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="no-results">
        <svg className="no-results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <p>Tell us what you're looking for!</p>
      </div>
    );
  }

  return (
    <div className="recommendation-list">
      <h3 className="results-title">Recommended Destinations for You</h3>
      <div className="cards-grid">
        {recommendations.map((item, index) => (
          <div key={index} className="recommendation-card">
            <div className="card-header">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3 className="card-title">{item.place || item.name || `Destination ${index + 1}`}</h3>
            </div>
            {item.description && <p className="card-description">{item.description}</p>}
            {item.rating && (
              <div className="card-rating">
                <span className="stars">{'⭐'.repeat(Math.round(item.rating))}</span>
                <span className="rating-value">{item.rating}</span>
              </div>
            )}
            {item.category && <span className="card-category">{item.category}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
