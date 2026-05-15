from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import Ticket
from schemas import TicketCreate, TicketUpdate


def get_tickets(
    db: Session,
    skip: int = 0,
    limit: int = 200,
    status: str = None,
    category: str = None,
    priority: str = None,
):
    query = db.query(Ticket)
    if status:
        query = query.filter(Ticket.status == status)
    if category:
        query = query.filter(Ticket.issue_category == category)
    if priority:
        query = query.filter(Ticket.priority == priority)
    return query.order_by(Ticket.created_at.desc()).offset(skip).limit(limit).all()


def get_ticket(db: Session, ticket_id: int):
    return db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()


def create_ticket(db: Session, ticket: TicketCreate):
    db_ticket = Ticket(**ticket.model_dump())
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


def update_ticket(db: Session, ticket_id: int, ticket: TicketUpdate):
    db_ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    if not db_ticket:
        return None
    for key, value in ticket.model_dump(exclude_unset=True).items():
        setattr(db_ticket, key, value)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


def delete_ticket(db: Session, ticket_id: int):
    db_ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    if not db_ticket:
        return None
    db.delete(db_ticket)
    db.commit()
    return db_ticket


def search_tickets(
    db: Session,
    q: str = None,
    status: str = None,
    category: str = None,
    priority: str = None,
):
    query = db.query(Ticket)
    if q:
        query = query.filter(
            or_(
                Ticket.description.ilike(f"%{q}%"),
                Ticket.employee_name.ilike(f"%{q}%"),
                Ticket.issue_category.ilike(f"%{q}%"),
                Ticket.department.ilike(f"%{q}%"),
                Ticket.resolution_notes.ilike(f"%{q}%"),
            )
        )
    if status:
        query = query.filter(Ticket.status == status)
    if category:
        query = query.filter(Ticket.issue_category == category)
    if priority:
        query = query.filter(Ticket.priority == priority)
    return query.order_by(Ticket.created_at.desc()).all()
