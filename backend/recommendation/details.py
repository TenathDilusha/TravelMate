import pandas as pd

def locations():
    df = pd.read_csv("../Reviews.csv")
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
    df = pd.read_csv("../Reviews.csv")
    loc = {}

    for index, row in df.iterrows():
        l_type = row["Location_Type"]
        place = row["Location_Name"]

        if l_type not in loc:
            loc[l_type] = []

        if place not in loc[l_type]:
            loc[l_type].append(place)

    return loc
