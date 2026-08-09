import os
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from recommender import recommend
from details import locations, location_type, get_top_reviews
from auth import router as auth_router, ensure_users_table, frontend_url

app = FastAPI()

# Credentials + cookies require explicit origins (cannot use "*")
_cors_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", frontend_url()).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.on_event("startup")
def on_startup():
    try:
        ensure_users_table()
    except Exception as exc:
        print(f"Warning: could not ensure users table: {exc}")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "TravelMate API is running"}

@app.head("/")
def head_root():
    return None

@app.get("/reviews")
def get_reviews(location_name: str = Query(..., description="Name of the location")):
    return get_top_reviews(location_name)

@app.post("/recommend")
def recommend_places(payload: dict):
    return recommend(payload["preferences"])

@app.get("/locations")
def get_locations():
    return locations()

@app.get("/location-types")
def get_location_types():
    return location_type()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000)) 
    uvicorn.run("app:app", host="0.0.0.0", port=port)
