export default function Features() {
  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
          <path d="M12 18V6"></path>
        </svg>
      ),
      title: "Smart AI Engine",
      description: "Our advanced AI analyzes thousands of Sri Lankan destinations to match your preferences perfectly."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      ),
      title: "Island-Wide Coverage",
      description: "Explore every corner of Sri Lanka, from ancient cities to coastal paradises and misty highlands."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      title: "Personalized Results",
      description: "Get tailored recommendations based on your unique travel style and interests across Sri Lanka."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      ),
      title: "Verified Reviews",
      description: "All recommendations backed by real traveler reviews and ratings from Sri Lankan adventures."
    }
  ];

  return (
    <section className="features-section">
      <div className="container">
        <h2 className="section-title">Why Choose TravelMate Sri Lanka?</h2>
        <p className="section-subtitle">Discover the features that make us your perfect Sri Lankan travel companion</p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
