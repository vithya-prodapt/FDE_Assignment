from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from database import Base


class Ticket(Base):
    __tablename__ = "tickets"

    ticket_id = Column(Integer, primary_key=True, index=True)
    employee_name = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)
    issue_category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(String(20), nullable=False)
    status = Column(String(20), nullable=False, default="Open")
    resolution_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
