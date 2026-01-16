import { useState } from "react";
import RecommendationForm from "./components/RecommendationForm";
import RecommendationList from "./components/RecommendationList";
import { getRecommendations } from "./services/api";
import "./styles/styles.css";

export default function App() {
  const [recommendations, setRecommendations] = useState([]);

  const handleSubmit = async (preferences) => {
    const results = await getRecommendations(preferences);
    setRecommendations(results);
  };

  return (
    <div className="app-container">
      <h1>TravelMate</h1>
      <RecommendationForm onSubmit={handleSubmit} />
      <RecommendationList recommendations={recommendations} />
    </div>
  );
}
