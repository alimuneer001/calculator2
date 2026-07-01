# 🧮 Full-Stack Calculator App

A beginner-friendly full-stack web application where users can **register**, **log in**,
perform **math calculations**, and save their **calculation history** in a PostgreSQL database.

Built as a **monorepo** with a React frontend and a Node/Express backend.

---

## ✨ Features

- 🔐 **Authentication** — Sign up & log in with JWT tokens and bcrypt-hashed passwords
- ➕ **Calculator** — Addition, subtraction, multiplication, division (with validation)
- 📜 **History** — Every calculation is saved per user
- 🗑️ **History management** — Delete one item or clear all
- 🔒 **Protected routes** — Dashboard requires a valid token
- 🎁 **Bonus features** — Dark Mode, Search history, and Sorting (newest / oldest)

---

## 🗂️ Project Structure

```
calculator2/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.js                # loads & validates env vars (fail fast)
│   │   │   └── db.js                 # PostgreSQL connection
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT auth middleware
│   │   │   └── errorHandler.js       # 404 + central error handler
│   │   ├── utils/
│   │   │   ├── asyncHandler.js       # removes repetitive try/catch
│   │   │   └── calculate.js          # safe expression evaluator
│   │   ├── controllers/              # request handlers
│   │   ├── routes/                   # API routes
│   │   └── index.js                  # server entry point
│   ├── schema.sql                    # database tables
│   ├── setup-db.js                   # one-command DB setup helper
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/api.js                # Axios instance (adds JWT)
│   │   ├── context/                  # Auth & Theme state
│   │   ├── components/               # Navbar, TextField, RecentsModal, ProtectedRoute
│   │   ├── pages/                    # Login, Signup, Dashboard
│   │   ├── validation/schemas.js     # Yup form rules
│   │   ├── utils/evaluate.js         # live calculator preview
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── .prettierrc                       # shared code formatting
├── README.md
└── .gitignore
```

---

## 🛠️ Tech Stack

| Layer     | Technology                                  |
|-----------|---------------------------------------------|
| Frontend  | React, React Router, Axios, Tailwind CSS    |
| Backend   | Node.js, Express.js, JWT, bcrypt            |
| Database  | PostgreSQL                                  |

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- [PostgreSQL](https://www.postgresql.org/) installed and running

### 2. Set up the database

Create a database (e.g. `calculator_db`), then create the tables:

```bash
psql -U postgres -c "CREATE DATABASE calculator_db;"
psql -U postgres -d calculator_db -f backend/schema.sql
```

### 3. Set up the backend

```bash
cd backend
npm install
cp .env.example .env      # then edit .env with your DB password & a JWT secret
npm run dev               # starts on http://localhost:5000
```

### 4. Set up the frontend

```bash
cd frontend
npm install
# optional: cp .env.example .env   (only needed if the backend isn't on localhost:5000)
npm run dev               # starts on http://localhost:5173
```

Open **http://localhost:5173** in your browser. 🎉

---

## 📡 API Endpoints

### Auth
| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| POST   | `/api/auth/register` | Register a user    |
| POST   | `/api/auth/login`    | Log in a user      |

### Calculations (require `Authorization: Bearer <token>`)
| Method | Endpoint                | Description               |
|--------|-------------------------|---------------------------|
| POST   | `/api/calculations`     | Create a calculation      |
| GET    | `/api/calculations`     | Get the user's history    |
| DELETE | `/api/calculations/:id` | Delete one calculation    |
| DELETE | `/api/calculations`     | Clear all history         |

**Example — create a calculation:**
```json
POST /api/calculations
{
  "expression": "17*64"
}
```
Response:
```json
{
  "id": 1,
  "user_id": 3,
  "expression": "17*64",
  "result": 1088,
  "created_at": "2026-06-24T12:00:00Z"
}
```
The backend safely evaluates the expression (only numbers and the operators
`+ - * / % ( )` are allowed) and rejects invalid input or division by zero.

---

## 🗃️ Database Design

**users**
| Column     | Type      |
|------------|-----------|
| id         | SERIAL PK |
| name       | VARCHAR   |
| email      | VARCHAR (unique) |
| password   | VARCHAR (hashed) |
| created_at | TIMESTAMP |

**calculations**
| Column     | Type      |
|------------|-----------|
| id         | SERIAL PK |
| user_id    | INTEGER FK → users(id) |
| expression | VARCHAR   |
| result     | DOUBLE PRECISION |
| created_at | TIMESTAMP |

---

## 🔑 How Authentication Works (simple explanation)

1. When you **sign up**, your password is **hashed** with bcrypt and stored — never the plain password.
2. When you **log in**, the server checks your password and gives you a **JWT token**.
3. The frontend saves this token and sends it with every request.
4. The `authenticateUser` middleware **verifies the token** before letting you access protected routes.
