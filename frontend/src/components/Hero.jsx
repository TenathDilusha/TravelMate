import { useState, useEffect } from 'react';

const SLIDES = [
  { src: '/images/sri-lanka.jpeg',  label: 'Sigiriya Rock Fortress' },
  { src: '/images/Galle.jpg',       label: 'Galle Fort' },
  { src: '/images/kandy-3.jpg',     label: 'Kandy Temple' },
  { src: '/images/waterfall.jpg',   label: 'Diyaluma Falls' },
  { src: '/images/train.jpg', label: 'Sri Lanka' },
  { src: '/images/galle2.jpg',      label: 'Galle Harbour' },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % SLIDES.length);
        setFading(false);
      }, 600);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero hero-fullpage">
      <div className="hero-overlay"></div>

      <div className="hero-split">
        {/* Left — text content */}
        <div className="hero-text-side">
          <span className="hero-eyebrow">✦ Your AI Travel Companion</span>
          <h1 className="hero-title">
            Discover the <span className="hero-highlight">Pearl</span> of<br />
            the Indian Ocean
          </h1>
          <p className="hero-subtitle">
            From misty tea-draped highlands to golden shores kissed by two oceans —
            let our AI guide you to Sri Lanka's most extraordinary corners, perfectly
            matched to your travel style.
          </p>

          <div className="hero-features">
            <div className="hero-feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              <span>70+ Destinations</span>
            </div>
            <div className="hero-feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span>10K+ Traveler Reviews</span>
            </div>
            <div className="hero-feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
              </svg>
              <span>AI-Powered Picks</span>
            </div>
          </div>

          <div className="hero-cta-group">
            <a href="/discover" className="btn-hero-primary">Start Exploring</a>
            <a href="/about" className="btn-hero-secondary">How It Works</a>
          </div>
        </div>

        {/* Right — full-height slideshow */}
        <div className="hero-image-side">
          <div className={`hero-slideshow ${fading ? 'slide-fading' : ''}`}>
            <img
              src={SLIDES[current].src}
              alt={SLIDES[current].label}
              className="hero-slide-img"
            />
            <div className="hero-slide-overlay"></div>
            <div className="hero-slide-label">{SLIDES[current].label}</div>
            <div className="hero-slide-dots">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={`slide-dot ${i === current ? 'active' : ''}`}
                  onClick={() => { setFading(true); setTimeout(() => { setCurrent(i); setFading(false); }, 600); }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

