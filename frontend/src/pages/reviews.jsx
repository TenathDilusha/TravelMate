import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ReviewsPage() {
  const { locationName } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:8000/reviews?location_name=${encodeURIComponent(locationName)}`);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [locationName]);

  const renderStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  return (
    <div className="reviews-page">
      <div className="container">
        <Link to="/places" className="back-link-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Places
        </Link>
      </div>
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">{locationName}</h1>
          <p className="page-subtitle">Top 5 Reviews from Travelers</p>
        </div>
      </section>

      <div className="container">
        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Loading reviews...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>{error}</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="no-results">
            <p>No reviews found for this location.</p>
          </div>
        ) : (
          <div className="reviews-list">
            {reviews.map((review, idx) => (
              <div key={idx} className="review-card">
                <div className="review-header">
                  <div className="review-meta">
                    <span className="review-rating">{renderStars(review.Rating)}</span>
                    <span className="review-date">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      {review.Published_Date?.slice(0,10)}
                    </span>
                  </div>
                </div>
                <h3 className="review-title">{review.Title}</h3>
                <p className="review-text">{review.Text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
