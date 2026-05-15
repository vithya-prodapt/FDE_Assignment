from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers.tickets import router as tickets_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Helpdesk Ticket Management API",
    description="REST API for managing internal IT support tickets",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tickets_router, tags=["Tickets"])


@app.get("/", tags=["Health"])
def root():
    return {"message": "Helpdesk Ticket Management API", "version": "1.0.0", "docs": "/docs"}
