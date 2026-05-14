from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import crud
import schemas

router = APIRouter(tags=["Borrowers"])


@router.get("/borrowers", response_model=List[schemas.Borrower])
def get_borrowers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_borrowers(db, skip=skip, limit=limit)


@router.post("/borrowers", response_model=schemas.Borrower, status_code=201)
def create_borrower(borrower: schemas.BorrowerCreate, db: Session = Depends(get_db)):
    return crud.create_borrower(db, borrower)


@router.put("/borrowers/{borrower_id}", response_model=schemas.Borrower)
def update_borrower(borrower_id: int, borrower: schemas.BorrowerUpdate, db: Session = Depends(get_db)):
    db_borrower = crud.update_borrower(db, borrower_id, borrower)
    if not db_borrower:
        raise HTTPException(status_code=404, detail="Borrower not found")
    return db_borrower


@router.delete("/borrowers/{borrower_id}")
def delete_borrower(borrower_id: int, db: Session = Depends(get_db)):
    db_borrower = crud.delete_borrower(db, borrower_id)
    if not db_borrower:
        raise HTTPException(status_code=404, detail="Borrower not found")
    return {"message": "Borrower deleted successfully"}
