# Library Management System — Phase 1

A full-stack web application for managing library books, borrowers, and transactions.

## Tech Stack

| Layer    | Technology                  |
|----------|-----------------------------|
| Frontend | React 18, React Router v6, Axios |
| Backend  | Python FastAPI, SQLAlchemy  |
| Database | SQLite                      |

---

## Project Structure

```
library-management-system/
├── backend/
│   ├── main.py            # FastAPI app entry point
│   ├── database.py        # SQLAlchemy engine & session
│   ├── models.py          # ORM models (Book, Borrower, Transaction)
│   ├── schemas.py         # Pydantic request/response schemas
│   ├── crud.py            # Database CRUD operations
│   ├── routers/
│   │   ├── books.py       # /books endpoints
│   │   ├── borrowers.py   # /borrowers endpoints
│   │   └── transactions.py# /borrow, /return, /transactions, /search
│   └── requirements.txt
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── App.jsx
        ├── App.css
        ├── index.js
        ├── components/
        │   └── Navbar.jsx
        ├── pages/
        │   ├── Dashboard.jsx
        │   ├── Books.jsx
        │   ├── Borrowers.jsx
        │   ├── BorrowReturn.jsx
        │   └── Search.jsx
        └── services/
            └── api.js
```

---

## Setup & Installation

### Prerequisites
- Python 3.9+
- Node.js 16+

### Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload
```

Backend runs at: **http://localhost:8000**  
Interactive API docs: **http://localhost:8000/docs**

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the app
npm start
```

Frontend runs at: **http://localhost:3000**

---

## API Reference

### Books

| Method | Endpoint        | Description      |
|--------|-----------------|------------------|
| GET    | /books          | Get all books    |
| GET    | /books/{id}     | Get book by ID   |
| POST   | /books          | Add new book     |
| PUT    | /books/{id}     | Update book      |
| DELETE | /books/{id}     | Delete book      |

### Borrowers

| Method | Endpoint            | Description          |
|--------|---------------------|----------------------|
| GET    | /borrowers          | Get all borrowers    |
| POST   | /borrowers          | Add borrower         |
| PUT    | /borrowers/{id}     | Update borrower      |
| DELETE | /borrowers/{id}     | Delete borrower      |

### Transactions

| Method | Endpoint       | Description              |
|--------|----------------|--------------------------|
| POST   | /borrow        | Borrow a book            |
| POST   | /return        | Return a book            |
| GET    | /transactions  | Get all transactions     |

### Search

| Method | Endpoint                              | Description         |
|--------|---------------------------------------|---------------------|
| GET    | /search?q=keyword&category=x&author=y | Search books        |

---

## Features

- **Dashboard** — Stats overview (total, available, borrowed) + recent transactions
- **Book Management** — Full CRUD with status badges and modal forms
- **Borrower Management** — Full CRUD with email validation
- **Borrow / Return** — Issue books, return with one click, full history
- **Search** — Keyword + category + author filter with live results
