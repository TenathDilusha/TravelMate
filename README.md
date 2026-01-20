# TravelMate – Sri Lanka Tourism Companion Chatbot

TravelMate is a **tourism companion chatbot** for Sri Lanka that provides travel recommendations, information about places, and AI-powered suggestions to help users plan their trips. It consists of a **backend** built with FastAPI and a **frontend** built with a JavaScript framework (React/Vite).  

---

## **Project Structure**

```bash
TravelMate/
│
├── backend/
│   ├── api/
│   │   └── api.yaml
│   ├── recommendation/
│   │   ├── app.py
│   │   ├── details.py
│   │   ├── recommender.py
│   │   └── vectorizer.py
│   ├── requirements.txt
│   └── Reviews.csv
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── images/
│   │       └── sl.jpg
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   ├── components/
│   │   │   ├── Features.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── form.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Hero.jsx
│   │   │   └── list.jsx
│   │   ├── pages/
│   │   │   ├── about.jsx
│   │   │   ├── contacts.jsx
│   │   │   ├── home.jsx
│   │   │   ├── places.jsx
│   │   │   └── reviews.jsx
│   │   │   └── discover.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── styles/
│   │       └── styles.css
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## **Setup Instructions**

### **1. Backend (FastAPI)**

1. Open terminal/command prompt.  
2. Navigate to the recommendation folder:

```bash
cd d:/python/TravelMate/backend/recommendation
```
Install dependencies
```bash
Install required dependencies:
```
pip install -r ../requirements.txt

Run the backend server with Uvicorn:
```bash
uvicorn app:app --reload
Backend will be available at: http://127.0.0.1:8000/
```

2. Frontend
Open a new terminal.

Navigate to the frontend folder:

```bash
cd d:/python/TravelMate/frontend
```
Install dependencies:
```bash
npm install
```
Run the frontend server:
```bash
npm run dev
```
Frontend will be available at the local dev server (http://localhost:5173 using Vite).

Usage
Open the frontend URL in your browser.

Use the Navbar to navigate: Home | Places | Recommend | About.

Go to Recommend to ask questions and get AI-powered travel suggestions.

Dependencies
Backend: FastAPI, Uvicorn, pandas, Pydantic (see requirements.txt)

Frontend: Node.js, npm, React/Vite (see package.json)


License
MIT License

---
