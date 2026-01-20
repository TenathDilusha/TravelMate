import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/home";
import Places from "./pages/places";
import About from "./pages/about";
import Contact from "./pages/contacts";
import ReviewsPage from "./pages/reviews";
import "./styles/styles.css";

export default function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/places" element={<Places />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reviews/:locationName" element={<ReviewsPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
