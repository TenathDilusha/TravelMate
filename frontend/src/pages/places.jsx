import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../services/api";

export default function Places() {
  const [locationsByCity, setLocationsByCity] = useState({});
  const [locationsByType, setLocationsByType] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("city");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesResponse, typesResponse] = await Promise.all([
          fetch(`${API_BASE}/locations`),
          fetch(`${API_BASE}/location-types`)
        ]);

        if (!citiesResponse.ok || !typesResponse.ok) {
          throw new Error("Failed to fetch data from server");
        }

        const citiesData = await citiesResponse.json();
        const typesData = await typesResponse.json();

        setLocationsByCity(citiesData);
        setLocationsByType(typesData);
      } catch (error) {
        console.error("Error fetching locations:", error);
        setError("Could not connect to the server. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const filterData = (data) => {
    if (!searchQuery.trim()) return data;
    
    const query = searchQuery.toLowerCase();
    const filtered = {};
    
    Object.entries(data).forEach(([key, places]) => {
      const filteredPlaces = places.filter(place => 
        place.toLowerCase().includes(query) || key.toLowerCase().includes(query)
      );
      if (filteredPlaces.length > 0) {
        filtered[key] = filteredPlaces;
      }
    });
    
    return filtered;
  };

  const getTypeIcon = (type) => {
    const icons = {
      'Beach': '🏖️',
      'Temple': '🛕',
      'Museum': '🏛️',
      'National Park': '🌿',
      'Wildlife': '🦁',
      'Waterfall': '💧',
      'Historical': '🏰',
      'Garden': '🌺',
      'Lake': '🌊',
      'Tea': '🍵',
      'default': '📍'
    };
    const key = Object.keys(icons).find(k => type.toLowerCase().includes(k.toLowerCase()));
    return icons[key] || icons.default;
  };

  const getCityIcon = (city) => {
    const icons = {
      'Colombo': '🏙️',
      'Kandy': '🏔️',
      'Galle': '🏰',
      'Ella': '🌄',
      'Sigiriya': '🗿',
      'Nuwara Eliya': '🍃',
      'Anuradhapura': '🛕',
      'Trincomalee': '🏖️',
      'Jaffna': '🌴',
      'default': '📍'
    };
    return icons[city] || icons.default;
  };

  const cardColors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  ];

  const filteredCities = filterData(locationsByCity);
  const filteredTypes = filterData(locationsByType);
  const currentData = activeTab === "city" ? filteredCities : filteredTypes;

  return (
    <div className="places-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">Explore Sri Lankan Destinations</h1>
          <p className="page-subtitle">
            Discover the wonders of the Pearl of the Indian Ocean
          </p>
        </div>
      </section>

      <div className="container">
        {/* Search Bar */}
        <div className="search-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search destinations, cities, or types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="places-tabs">
          <button
            className={`tab-button ${activeTab === "city" ? "active" : ""}`}
            onClick={() => setActiveTab("city")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            By City
          </button>
          <button
            className={`tab-button ${activeTab === "type" ? "active" : ""}`}
            onClick={() => setActiveTab("type")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
            By Type
          </button>
        </div>

        {/* Results Count */}
        {searchQuery && (
          <div className="search-results-info">
            Found {Object.values(currentData).flat().length} destinations 
            in {Object.keys(currentData).length} {activeTab === "city" ? "cities" : "categories"}
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Loading destinations...</p>
          </div>
        ) : error ? (
          <div className="no-results">
            <p>⚠️ {error}</p>
          </div>
        ) : Object.keys(currentData).length === 0 ? (
          <div className="no-results">
            {searchQuery
              ? <p>No destinations found for "{searchQuery}"</p>
              : <p>No destinations available.</p>
            }
          </div>
        ) : (
          <div className="accordion-container">
            {Object.entries(currentData).map(([key, places], idx) => (
              <div key={idx} className="accordion-item">
                <button
                  className={`accordion-header ${expandedSections[key] ? "expanded" : ""}`}
                  onClick={() => toggleSection(key)}
                  style={{ borderLeftColor: cardColors[idx % cardColors.length].includes('#') ? '#667eea' : undefined }}
                >
                  <div className="accordion-header-left">
                    <span className="accordion-icon">
                      {activeTab === "city" ? getCityIcon(key) : getTypeIcon(key)}
                    </span>
                    <span className="accordion-title">{key}</span>
                    <span className="accordion-count">{places.length} places</span>
                  </div>
                  <svg className="accordion-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                
                <div className={`accordion-content ${expandedSections[key] ? "expanded" : ""}`}>
                  <div className="compact-cards-grid">
                    {places.map((place, index) => (
                      <div 
                        key={index} 
                        className="compact-place-card"
                        style={{ background: cardColors[index % cardColors.length] }}
                        onClick={() => navigate(`/reviews/${encodeURIComponent(place)}`)}
                        role="button"
                        tabIndex={0}
                        onKeyPress={e => { if (e.key === 'Enter') navigate(`/reviews/${encodeURIComponent(place)}`); }}
                      >
                        <span className="compact-card-name">{place}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
