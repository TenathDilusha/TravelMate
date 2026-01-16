export default function RecommendationList({ recommendations }) {
  if (!recommendations || recommendations.length === 0) {
    return <p className="no-results">No recommendations yet.</p>;
  }

  return (
    <div className="recommendation-list">
      {recommendations.map((item, index) => (
        <div key={index} className="recommendation-card">
          <h3>{item.place}</h3>
          {item.description && <p>{item.description}</p>}
          <p>Score: {item.score.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}
