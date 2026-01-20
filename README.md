# TravelMate – Sri Lanka Tourism Companion Chatbot

TravelMate is a **tourism companion chatbot** for Sri Lanka that provides travel recommendations, information about places, and AI-powered suggestions to help users plan their trips. It consists of a **backend** built with FastAPI and a **frontend** built with a JavaScript framework (React/Vite/Next.js).  

---

## **Project Structure**

TravelMate/
│
├─ backend/
│ ├─ app.py
│ ├─ requirements.txt
│ └─ recommendation/ # AI recommendation module
│
└─ frontend/
├─ package.json
└─ src/ # React/Vue/JSX components


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

If you want, I can also **add a small “Quick Start” diagram** showing how backend and frontend connect, which makes it easier for new developers to understand your TravelMate project.  

Do you want me to add that diagram?



