export default function About() {
  return (
    <div className="about-page">
      <section className="page-hero about-hero">
        <div className="container">
          <h1 className="page-title">About TravelMate Sri Lanka</h1>
          <p className="page-subtitle">
            Your AI-powered guide to discovering the wonders of Sri Lanka
          </p>
        </div>
      </section>

      <div className="container">
        <section className="about-content">
          <div className="about-section">
            <div className="about-icon">🌏</div>
            <h2>Our Mission</h2>
            <p>
              TravelMate is dedicated to helping travelers discover the hidden gems and popular attractions 
              of Sri Lanka through intelligent, personalized recommendations. We combine cutting-edge AI 
              technology with deep local knowledge to create unforgettable travel experiences.
            </p>
          </div>

          <div className="about-section">
            
            <div className="about-icon">
              <img src="/images/sl.jpg" alt="Sri Lanka" className="sri-lanka-flag-icon" />
            </div>
            
            <h2>Why Sri Lanka?</h2>
            <p>
              Known as the "Pearl of the Indian Ocean," Sri Lanka is a land of incredible diversity. 
              From ancient kingdoms and sacred temples to pristine beaches and lush tea plantations, 
              this island nation offers experiences that captivate every type of traveler. Our platform 
              helps you navigate this rich tapestry of culture, nature, and adventure.
            </p>
          </div>

          <div className="about-section">
            <div className="about-icon">🤖</div>
            <h2>How It Works</h2>
            <p>
              Our AI-powered recommendation engine analyzes thousands of traveler reviews, ratings, 
              and preferences to suggest destinations that match your interests. Simply tell us what 
              you're looking for - whether it's beaches, historical sites, wildlife, or adventure - 
              and we'll provide personalized recommendations tailored to your travel style.
            </p>
          </div>

          <div className="about-section stats-section">
            <h2>TravelMate by the Numbers</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">70+</div>
                <div className="stat-label">Sri Lankan Destinations</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Traveler Reviews</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">AI</div>
                <div className="stat-label">AI-Powered Recommendations</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Available Support</div>
              </div>
            </div>
          </div>

          <div className="about-section">
            <div className="about-icon">🌟</div>
            <h2>What Makes Us Special</h2>
            <div className="features-list">
              <div className="feature-item">
                <h3>AI-Powered Insights</h3>
                <p>Advanced machine learning algorithms analyze vast amounts of travel data to provide accurate recommendations.</p>
              </div>
              <div className="feature-item">
                <h3>Local Expertise</h3>
                <p>Our recommendations are backed by local knowledge and authentic traveler experiences across Sri Lanka.</p>
              </div>
              <div className="feature-item">
                <h3>Personalized Experience</h3>
                <p>Every recommendation is tailored to your unique preferences, ensuring you find exactly what you're looking for.</p>
              </div>
              <div className="feature-item">
                <h3>Comprehensive Coverage</h3>
                <p>From popular tourist attractions to off-the-beaten-path gems, we cover all corners of this beautiful island.</p>
              </div>
            </div>
          </div>

          <div className="about-section cta-section">
            <h2>Start Your Sri Lankan Adventure Today</h2>
            <p>
              Ready to explore the wonders of Sri Lanka? Let TravelMate be your guide to discovering 
              unforgettable experiences, hidden treasures, and the warm hospitality that makes this 
              island nation truly special.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
