from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from recommender import recommend
from details import locations, location_type, get_top_reviews
from fastapi import Query

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
