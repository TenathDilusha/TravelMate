import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isActive = (path) =>
    location.pathname === path ? "nav-link active" : "nav-link";

  const navLinks = [
    { to: "/",        label: "Home" },
    { to: "/places",  label: "Places" },
    { to: "/about",   label: "About" },
    { to: "/contact", label: "Contact" },
    { to: "/discover",label: "Discover" },
  ];

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span className="logo-text">TravelMate</span>
          </Link>

          {/* Desktop nav */}
          <nav className="nav desktop-nav">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className={isActive(to)}>{label}</Link>
            ))}
          </nav>

          {/* Hamburger button */}
          <button
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile backdrop */}
      <div
        className={`mobile-backdrop ${menuOpen ? "visible" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile slide-in drawer */}
      <nav className={`mobile-nav ${menuOpen ? "open" : ""}`}>
        <div className="mobile-nav-header">
          <span className="mobile-nav-title">Menu</span>
          <button className="mobile-nav-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <ul className="mobile-nav-list">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link to={to} className={`mobile-nav-link ${location.pathname === to ? "active" : ""}`}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
