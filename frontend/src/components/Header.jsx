import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

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
          <nav className="nav">
            <Link to="/" className={isActive("/")}>Home</Link>
            <Link to="/places" className={isActive("/places")}>Places</Link>
            <Link to="/about" className={isActive("/about")}>About</Link>
            <Link to="/contact" className={isActive("/contact")}>Contact</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
