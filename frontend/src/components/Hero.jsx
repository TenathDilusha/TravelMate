export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover the Pearl of the Indian Ocean
          </h1>
          <p className="hero-subtitle">
            AI-powered recommendations for exploring Sri Lanka's breathtaking landscapes, 
            ancient heritage sites, pristine beaches, and vibrant culture.
          </p>
          <div className="hero-features">
            <div className="hero-feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
              <span>8 UNESCO Sites</span>
            </div>
            <div className="hero-feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
              <span>70+ Destinations</span>
            </div>
            <div className="hero-feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>2500+ Years of History</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
