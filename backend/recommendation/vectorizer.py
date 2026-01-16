import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer

df = pd.read_csv("../Reviews.csv")

grouped = df.groupby("Location_Name")["Text"].apply(" ".join)

places = grouped.index.tolist()

vectorizer = TfidfVectorizer(stop_words="english")
place_vectors = vectorizer.fit_transform(grouped.values)
