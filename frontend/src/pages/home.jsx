import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import RecommendationForm from "../components/form";
import RecommendationList from "../components/list";
import Features from "../components/Features";
import { getRecommendations } from "../services/api";

export default function Home() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (preferences) => {
    setLoading(true);
    try {
      const results = await getRecommendations(preferences);
      setRecommendations(results);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

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
            <RecommendationForm onSubmit={handleSubmit} loading={loading} />
            <RecommendationList recommendations={recommendations} loading={loading} />
          </div>
        </section>
        <Features />
      </main>
    </>
  );
}
