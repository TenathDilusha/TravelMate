"""Fit TF-IDF on review text in Postgres and persist model + place vectors."""

import sys

from sklearn.feature_extraction.text import TfidfVectorizer
from psycopg2.extras import Json

from details import get_db_connection


DDL = """
CREATE TABLE IF NOT EXISTS tfidf_model (
  id SERIAL PRIMARY KEY,
  vocabulary JSONB NOT NULL,
  idf JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS place_vectors (
  location_id INTEGER PRIMARY KEY REFERENCES locations(id) ON DELETE CASCADE,
  vector JSONB NOT NULL
);
"""


def load_place_documents(cur):
    cur.execute(
        """
        SELECT l.id, l.name, COALESCE(string_agg(r.text, ' '), '') AS doc
        FROM locations l
        LEFT JOIN reviews r ON r.location_id = l.id
        GROUP BY l.id, l.name
        HAVING COALESCE(string_agg(r.text, ' '), '') <> ''
        ORDER BY l.id;
        """
    )
    return cur.fetchall()


def sparse_row_to_dict(row):
    return {str(int(idx)): float(val) for idx, val in zip(row.indices, row.data)}


def build_and_save():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(DDL)
    conn.commit()

    rows = load_place_documents(cur)
    if not rows:
        print("No locations with review text found. Run the CSV import first.")
        cur.close()
        conn.close()
        sys.exit(1)

    location_ids = [row[0] for row in rows]
    place_names = [row[1] for row in rows]
    documents = [row[2] for row in rows]

    print(f"Fitting TF-IDF on {len(documents)} places...")
    vectorizer = TfidfVectorizer(stop_words="english")
    place_matrix = vectorizer.fit_transform(documents)

    vocabulary = vectorizer.vocabulary_
    idf = vectorizer.idf_.tolist()

    cur.execute("DELETE FROM place_vectors;")
    cur.execute("DELETE FROM tfidf_model;")
    cur.execute(
        "INSERT INTO tfidf_model (vocabulary, idf) VALUES (%s, %s);",
        (Json(vocabulary), Json(idf)),
    )

    for i, location_id in enumerate(location_ids):
        sparse = sparse_row_to_dict(place_matrix.getrow(i))
        cur.execute(
            """
            INSERT INTO place_vectors (location_id, vector)
            VALUES (%s, %s)
            ON CONFLICT (location_id) DO UPDATE SET vector = EXCLUDED.vector;
            """,
            (location_id, Json(sparse)),
        )

    conn.commit()
    print(
        f"Saved TF-IDF model ({len(vocabulary)} terms) and "
        f"{len(place_names)} place vectors."
    )
    cur.close()
    conn.close()


if __name__ == "__main__":
    build_and_save()
