from fastapi import FastAPI
from recommender import recommend

app = FastAPI()

@app.post("/recommend")
def recommend_places(payload: dict):
    return recommend(payload["preferences"])
