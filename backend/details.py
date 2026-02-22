
import psycopg2
import os
from dotenv import load_dotenv

# Load from root .env (one level up from backend/)
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

def get_db_connection():
    neon_url = os.getenv("DATABASE_URL") or os.getenv("NEON_DATABASE_URL")
    if neon_url:
        return psycopg2.connect(neon_url)
    return psycopg2.connect(
        host=os.getenv("NEON_DB_HOST", "localhost"),
        user=os.getenv("NEON_DB_USER", "postgres"),
        password=os.getenv("NEON_DB_PASSWORD", ""),
        dbname=os.getenv("NEON_DB_NAME", "travelmate"),
        port=os.getenv("NEON_DB_PORT", 5432)
    )

def locations():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT city, name FROM locations;")
    rows = cur.fetchall()
    loc_dict = {}
    for city, name in rows:
        if city not in loc_dict:
            loc_dict[city] = []
        loc_dict[city].append(name)
    cur.close()
    conn.close()
    return loc_dict

def location_type():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT type, name FROM locations;")
    rows = cur.fetchall()
    loc_dict = {}
    for type_, name in rows:
        if type_ not in loc_dict:
            loc_dict[type_] = []
        loc_dict[type_].append(name)
    cur.close()
    conn.close()
    return loc_dict

def get_top_reviews(location_name):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT r.user_id, r.rating, r.title, r.text, r.published_date
        FROM reviews r
        JOIN locations l ON r.location_id = l.id
        WHERE l.name = %s
        ORDER BY r.rating DESC, r.published_date DESC
        LIMIT 5;
    """, (location_name,))
    rows = cur.fetchall()
    columns = ["User_ID", "Rating", "Title", "Text", "Published_Date"]
    result = [dict(zip(columns, row)) for row in rows]
    cur.close()
    conn.close()
    return result
