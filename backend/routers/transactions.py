from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import crud
import schemas

router = APIRouter(tags=["Transactions & Search"])


@router.post("/borrow", response_model=schemas.Transaction, status_code=201)
def borrow_book(borrow: schemas.BorrowRequest, db: Session = Depends(get_db)):
    transaction = crud.borrow_book(db, borrow)
    if not transaction:
        raise HTTPException(status_code=400, detail="Book is not available or does not exist")
    return transaction


@router.post("/return", response_model=schemas.Transaction)
def return_book(return_req: schemas.ReturnRequest, db: Session = Depends(get_db)):
    transaction = crud.return_book(db, return_req)
    if not transaction:
        raise HTTPException(status_code=400, detail="Transaction not found or book already returned")
    return transaction


@router.get("/transactions", response_model=List[schemas.Transaction])
def get_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_transactions(db, skip=skip, limit=limit)


@router.get("/search", response_model=List[schemas.Book])
def search_books(
    q: Optional[str] = None,
    category: Optional[str] = None,
    author: Optional[str] = None,
    db: Session = Depends(get_db),
):
    return crud.search_books(db, query=q, category=category, author=author)
