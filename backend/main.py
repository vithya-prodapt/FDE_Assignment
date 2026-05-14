from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import books, borrowers, transactions

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Library Management System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(books.router)
app.include_router(borrowers.router)
app.include_router(transactions.router)


@app.get("/")
def root():
    return {"message": "Library Management System API v1.0"}
