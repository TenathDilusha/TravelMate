import numpy as np
from scipy.sparse import csr_matrix, diags
from sklearn.feature_extraction.text import TfidfTransformer, TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from details import get_db_connection


def _rebuild_vectorizer(vocabulary, idf):
    """Rebuild a fitted TfidfVectorizer from stored vocabulary + IDF weights."""
    vectorizer = TfidfVectorizer(stop_words="english", vocabulary=vocabulary)
    idf_arr = np.asarray(idf, dtype=np.float64)
    n_features = len(idf_arr)
    # Unfitted TfidfVectorizer has no _tfidf until fit(); attach one manually.
    transformer = TfidfTransformer(norm="l2", use_idf=True, smooth_idf=True)
    transformer.idf_ = idf_arr
    transformer._idf_diag = diags(
        idf_arr, 0, shape=(n_features, n_features), format="csr"
    )
    vectorizer._tfidf = transformer
    vectorizer.idf_ = idf_arr
    return vectorizer, n_features


def _sparse_dicts_to_matrix(sparse_dicts, n_features):
    rows, cols, data = [], [], []
    for row_idx, sparse in enumerate(sparse_dicts):
        if not sparse:
            continue
        for key, value in sparse.items():
            rows.append(row_idx)
            cols.append(int(key))
            data.append(float(value))
    return csr_matrix(
        (data, (rows, cols)), shape=(len(sparse_dicts), n_features)
    )


def _load_tfidf_from_db():
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT vocabulary, idf FROM tfidf_model ORDER BY id DESC LIMIT 1;"
        )
        model_row = cur.fetchone()
        if not model_row:
            raise RuntimeError(
                "No TF-IDF model in database. Run: python3 build_vectors.py"
            )

        vocabulary, idf = model_row
        cur.execute(
            """
            SELECT l.name, pv.vector
            FROM place_vectors pv
            JOIN locations l ON l.id = pv.location_id
            ORDER BY l.id;
            """
        )
        place_rows = cur.fetchall()
        if not place_rows:
            raise RuntimeError(
                "No place vectors in database. Run: python3 build_vectors.py"
            )

        places = [row[0] for row in place_rows]
        sparse_dicts = [row[1] for row in place_rows]
        return vocabulary, idf, places, sparse_dicts
    finally:
        cur.close()
        conn.close()


def recommend(text):
    vocabulary, idf, places, sparse_dicts = _load_tfidf_from_db()
    vectorizer, n_features = _rebuild_vectorizer(vocabulary, idf)
    place_vectors = _sparse_dicts_to_matrix(sparse_dicts, n_features)

    user_vec = vectorizer.transform([text])
    scores = cosine_similarity(user_vec, place_vectors)[0]
    top = scores.argsort()[::-1][:5]

    return [{"place": places[i], "score": float(scores[i])} for i in top]
