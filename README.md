# Book Management System

A full-stack book management application built with **React** (frontend), **Flask** (backend), and **SQLite** (database). Supports user authentication with JWT and full CRUD operations on books.

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Bootstrap 5, Axios        |
| Backend   | Flask, Flask-JWT-Extended, Flask-CORS |
| Database  | SQLite 3 (built into Python)        |
| Container | Docker, Docker Compose, Nginx       |

---

## Project Structure

```
Book_management_impressico/
├── Client/                        # React frontend
│   ├── src/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── Books.jsx
│   │   ├── CreateBook.jsx
│   │   ├── UpdateBook.jsx
│   │   ├── Nav.jsx
│   │   └── main.jsx
│   ├── nginx.conf                 # Nginx config for React Router
│   ├── Dockerfile
│   └── package.json
├── Server/                        # Flask backend
│   ├── app.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── tests/
├── docker-compose.yml
└── README.md
```

---

## Running with Docker (Recommended)

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Start the app

```bash
git clone https://github.com/arun1-singh/-Book-Mng-.git
cd -Book-Mng-

docker compose up --build
```

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:3000      |
| Backend  | http://localhost:5000      |

The SQLite database is created automatically on first run at `/data/books.db` inside the backend container, persisted via a Docker volume (`sqlitedata`).

### Stop the app

```bash
docker compose down
```

---

## Running Locally (Without Docker)

### Backend Setup

1. **Navigate to the Server directory:**
   ```bash
   cd Server
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate        # Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask app:**
   ```bash
   python app.py
   ```
   The backend starts on `http://localhost:5000`.  
   SQLite database is created automatically at `/data/books.db` on first run.

### Frontend Setup

1. **Navigate to the Client directory:**
   ```bash
   cd Client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the dev server:**
   ```bash
   npm run dev
   ```
   The frontend starts on `http://localhost:5173`.

---

## Database

This project uses **SQLite** — no external database server required.

- SQLite is built into Python, so no installation or configuration is needed.
- The database file is stored at `/data/books.db` (Docker) or auto-created locally.
- Tables are created automatically when the app starts via `init_db()`.

### Schema

```sql
CREATE TABLE users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    username   TEXT NOT NULL,
    email      TEXT UNIQUE NOT NULL,
    password   TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE books (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    publisher TEXT NOT NULL,
    name      TEXT NOT NULL,
    date      TEXT NOT NULL,
    cost      REAL NOT NULL,
    edition   TEXT
);
```

---

## API Endpoints

All book endpoints require a JWT token in the `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint    | Description         | Auth Required |
|--------|-------------|---------------------|---------------|
| POST   | `/register` | Register a new user | No            |
| POST   | `/login`    | Login, returns JWT  | No            |

### Books

| Method | Endpoint         | Description        | Auth Required |
|--------|------------------|--------------------|---------------|
| GET    | `/`              | Get all books      | Yes           |
| POST   | `/create`        | Create a new book  | Yes           |
| PUT    | `/update/<id>`   | Update a book      | Yes           |
| DELETE | `/delete/<id>`   | Delete a book      | Yes           |

### Example — Create a book

```bash
curl -X POST http://localhost:5000/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "publisher": "O'\''Reilly",
    "name": "Learning Flask",
    "date": "2024-10-11",
    "cost": 399.99,
    "edition": "2nd"
  }'
```

---

## Authentication

- JWT tokens are issued on login and expire after **1 day**.
- Tokens are stored in `localStorage` on the frontend.
- Any 401 response automatically clears the token and redirects to `/login`.

---

## Features

- 🔐 User registration and login with hashed passwords
- 📚 Full CRUD for books (Create, Read, Update, Delete)
- 🔍 Search books by name or publisher
- 💰 Cost displayed with `Rs.` prefix
- 📱 Responsive UI with Bootstrap 5
- 🐳 Fully containerized with Docker Compose
- 🗄️ Zero-config SQLite database

---

## Troubleshooting

**Port already in use:**
```bash
# Check what's using the port
ss -tlnp | grep 5000

# Change the port in docker-compose.yml if needed
```

**CORS errors:**
- Make sure the backend is running on port 5000
- Flask-CORS is already configured to allow all origins

**Frontend shows 404 on refresh:**
- This is handled by `nginx.conf` — all routes fall back to `index.html`

**Token expired / 401 errors:**
- The app auto-redirects to login on 401
- Just log in again to get a fresh token

---

## License

This project is for educational purposes.
