from vectorizer import vectorizer, place_vectors, places
from sklearn.metrics.pairwise import cosine_similarity

def recommend(text):
    user_vec = vectorizer.transform([text])
    scores = cosine_similarity(user_vec, place_vectors)[0]
    top = scores.argsort()[::-1][:5]

    return [{"place": places[i], "score": float(scores[i])} for i in top]
