export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span className="logo-text">TravelMate</span>
            </div>
            <p className="footer-description">
              Your AI-powered travel companion for discovering amazing destinations around the world.
            </p>

          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="./places">Destinations</a></li>
              <li><a href="./about">About Us</a></li>
              <li><a href="./contact">Contact</a></li>
              s
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} TravelMate. All rights reserved.</p>
          <p>Made by Tenath Dilusha for travelers worldwide</p>
        </div>
      </div>
    </footer>
  );
}
