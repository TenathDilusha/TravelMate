import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import Features from "../components/Features";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Hero />
      <main className="main-content">
        <section className="search-section">
          <div className="container">
            <h2 className="section-title">Find Your Perfect Sri Lankan Destination</h2>
            <p className="section-subtitle">
              Tell us what you're looking for and we'll recommend amazing places across the Pearl of the Indian Ocean
            </p>
            <div className="discover-cta">
              <button 
                className="discover-cta-button"
                onClick={() => navigate('/discover')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <span>Start Discovering Destinations</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <p className="discover-cta-hint">Powered by AI • Personalized Recommendations</p>
            </div>
          </div>
        </section>
        <Features />
      </main>
    </>
  );
}
