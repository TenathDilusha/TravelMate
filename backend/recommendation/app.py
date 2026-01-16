from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from recommender import recommend
from details import locations, location_type

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/recommend")
def recommend_places(payload: dict):
    return recommend(payload["preferences"])

@app.get("/locations")
def get_locations():
    return locations()

@app.get("/location-types")
def get_location_types():
    return location_type()
