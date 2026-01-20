import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/home";
import Places from "./pages/places";
import About from "./pages/about";
import Contact from "./pages/contacts";
import ReviewsPage from "./pages/reviews";
import Discover from "./pages/discover";
import "./styles/styles.css";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/places" element={<Places />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/reviews/:locationName" element={<ReviewsPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
