# TravelMate-Backend

**TravelMate-Backend** is a travel recommendation platform backend that provides REST APIs for travel destinations, itineraries, and personalized travel suggestions. The project showcases **microservices architecture**, **API-first design**, and **cloud-native deployment** using ** Choreo**.  

The system is designed to be modular, making it easy to integrate additional features like **frontend interfaces** and **ML-based recommendations** in the future.

---

## Features

- **Destination Service**: Manage travel destinations categorized by type (beach, hill country, cultural, wildlife, etc.).
- **Recommendation Service**: Rule-based or future AI-powered recommendations based on travel type, budget, and duration.
- **Itinerary Service**: Generates day-wise travel plans using recommended destinations.
- **Integration Service**: Optionally connects to external APIs for weather, currency, or tourism data.
- **Cloud Deployment**: Each microservice is deployed independently on WSO2 Choreo, demonstrating API orchestration and service discovery.

---

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **API Style**: REST
- **Deployment**: Choreo
- **API Documentation**: Swagger (OpenAPI)


---

## Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/TenathDilusha/TravelMate-Backend.git
cd TravelMate-Backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Run services locally**
```bash
cd destination-service
npm start
```

## API Documentation

All APIs are documented using OpenAPI/Swagger and available in /docs folder.
Endpoints include:

GET /destinations – List all destinations

POST /recommendations – Get travel suggestions

GET /itinerary/{id} – Get day-wise plan

## Contributing

Contributions are welcome! Please open issues for bugs or feature requests.

## License

This project is licensed under the MIT License.
