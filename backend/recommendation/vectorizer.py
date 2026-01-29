import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
import os

# Get the path to Reviews.csv relative to this file
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
df = pd.read_csv(os.path.join(base_dir, "Reviews.csv"))

grouped = df.groupby("Location_Name")["Text"].apply(" ".join)

places = grouped.index.tolist()

vectorizer = TfidfVectorizer(stop_words="english")
place_vectors = vectorizer.fit_transform(grouped.values)
