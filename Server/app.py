import sqlite3
import os
import re
from datetime import timedelta

from flask import Flask, jsonify, request, g
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

# JWT Config
app.config["JWT_SECRET_KEY"] = "asdfghjkl"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)  # token valid for 1 day
jwt = JWTManager(app)

DB_PATH = os.environ.get("DB_PATH", "/data/books.db")


def get_db():
    """Return a per-request SQLite connection with dict-like rows."""
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(exc=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    """Create tables if they don't exist."""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS users (
                id       INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT    NOT NULL,
                email    TEXT    UNIQUE NOT NULL,
                password TEXT    NOT NULL,
                created_at TEXT  DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS books (
                id        INTEGER PRIMARY KEY AUTOINCREMENT,
                publisher TEXT    NOT NULL,
                name      TEXT    NOT NULL,
                date      TEXT    NOT NULL,
                cost      REAL    NOT NULL,
                edition   TEXT
            );
        """)


def parse_cost(value):
    """Strip non-numeric characters (e.g. 'Rs.399' -> 399.0)."""
    cleaned = re.sub(r'[^\d.]', '', str(value))
    return float(cleaned) if cleaned else None


# =============================
# REGISTER
# =============================
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email    = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"message": "All fields are required"}), 400

    hashed_password = generate_password_hash(password)
    db = get_db()

    existing = db.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
    if existing:
        return jsonify({"message": "Email already registered"}), 400

    db.execute(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        (username, email, hashed_password)
    )
    db.commit()
    return jsonify({"message": "User registered successfully"}), 201


# =============================
# LOGIN
# =============================
@app.route('/login', methods=['POST'])
def login():
    data     = request.get_json()
    email    = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400

    db   = get_db()
    user = db.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()

    if user and check_password_hash(user['password'], password):
        access_token = create_access_token(identity=str(user['id']))
        return jsonify({
            "message":      "Login successful",
            "access_token": access_token,
            "username":     user['username'],
            "email":        user['email']
        })

    return jsonify({"message": "Invalid email or password"}), 401


# =============================
# BOOKS CRUD
# =============================
@app.route('/', methods=['GET'])
@jwt_required()
def get_books():
    db     = get_db()
    rows   = db.execute("SELECT * FROM books").fetchall()
    result = [dict(row) for row in rows]
    print("Current User:", get_jwt_identity())
    return jsonify(result)


@app.route('/create', methods=['POST'])
@jwt_required()
def create_books():
    new_book = request.get_json()
    cost     = parse_cost(new_book.get('cost', 0))
    if cost is None:
        return jsonify({"message": "Invalid cost value"}), 400

    db = get_db()
    db.execute(
        "INSERT INTO books (publisher, name, date, cost, edition) VALUES (?, ?, ?, ?, ?)",
        (new_book['publisher'], new_book['name'], new_book['date'], cost, new_book['edition'])
    )
    db.commit()
    return jsonify(new_book), 201


@app.route('/update/<int:id>', methods=['PUT'])
@jwt_required()
def update_book(id):
    updated_book = request.get_json()
    cost         = parse_cost(updated_book.get('cost', 0))
    if cost is None:
        return jsonify({"message": "Invalid cost value"}), 400

    db = get_db()
    db.execute(
        "UPDATE books SET publisher=?, name=?, date=?, cost=?, edition=? WHERE id=?",
        (updated_book['publisher'], updated_book['name'], updated_book['date'], cost, updated_book['edition'], id)
    )
    db.commit()
    return jsonify(updated_book)


@app.route('/delete/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_book(id):
    db = get_db()
    db.execute("DELETE FROM books WHERE id=?", (id,))
    db.commit()
    return jsonify({'result': 'Book deleted'})


if __name__ == '__main__':
    init_db()
    app.run(debug=True, host="0.0.0.0", port=5000)
