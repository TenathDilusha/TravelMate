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
import Login from "./pages/login";
import Register from "./pages/register";
import AuthCallback from "./pages/authCallback";
import { AuthProvider } from "./context/AuthContext";
import "./styles/styles.css";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppShell() {
  const { pathname } = useLocation();
  const isAuthPage =
    pathname === "/login" || pathname === "/register" || pathname.startsWith("/auth/");

  return (
    <div className={`app ${isAuthPage ? "app-auth" : ""}`}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/places" element={<Places />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/reviews/:locationName" element={<ReviewsPage />} />
      </Routes>
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppShell />
      </Router>
    </AuthProvider>
  );
}
