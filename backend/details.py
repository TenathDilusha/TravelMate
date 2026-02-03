import pandas as pd

df = pd.read_csv("./Reviews.csv")

def locations():
    loc = df.groupby("Located_City")["Location_Name"].unique().apply(list).to_dict()
    return loc

def location_type():
    loc = df.groupby("Location_Type")["Location_Name"].unique().apply(list).to_dict()
    return loc

def get_top_reviews(location_name):
    reviews = df[df["Location_Name"] == location_name]
    reviews_sorted = reviews.sort_values(by=["Rating", "Published_Date"], ascending=[False, False])
    top_reviews = reviews_sorted.head(5)
    return top_reviews[["User_ID", "Rating", "Title", "Text", "Published_Date"]].to_dict(orient="records")
