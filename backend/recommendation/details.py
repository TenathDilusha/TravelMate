import pandas as pd
import os

# Get the path to Reviews.csv relative to this file
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
df = pd.read_csv(os.path.join(base_dir, "Reviews.csv"))

def locations():
    loc = {}

    for index, row in df.iterrows():
        city = row["Located_City"]
        place = row["Location_Name"]

        if city not in loc:
            loc[city] = []

        if place not in loc[city]:
            loc[city].append(place)

    return loc

def location_type():
    loc = {}

    for index, row in df.iterrows():
        l_type = row["Location_Type"]
        place = row["Location_Name"]

        if l_type not in loc:
            loc[l_type] = []

        if place not in loc[l_type]:
            loc[l_type].append(place)

    return loc

def get_top_reviews(location_name):
    reviews = df[df["Location_Name"] == location_name]
    reviews_sorted = reviews.sort_values(by=["Rating", "Published_Date"], ascending=[False, False])
    top_reviews = reviews_sorted.head(5)
    return top_reviews[["User_ID", "Rating", "Title", "Text", "Published_Date"]].to_dict(orient="records")
