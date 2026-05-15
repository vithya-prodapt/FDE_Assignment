from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional
from datetime import datetime

VALID_PRIORITIES = {"Low", "Medium", "High", "Critical"}
VALID_STATUSES = {"Open", "In Progress", "Resolved", "Closed"}
VALID_CATEGORIES = {
    "VPN Issue", "Password Reset", "Software Installation",
    "Laptop Issue", "Email Access", "Network Connectivity",
    "Hardware Request", "Other"
}


class TicketCreate(BaseModel):
    employee_name: str
    department: str
    issue_category: str
    description: str
    priority: str
    status: str = "Open"
    resolution_notes: Optional[str] = None

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v):
        if v not in VALID_PRIORITIES:
            raise ValueError(f"Priority must be one of {VALID_PRIORITIES}")
        return v

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        if v not in VALID_STATUSES:
            raise ValueError(f"Status must be one of {VALID_STATUSES}")
        return v


class TicketUpdate(BaseModel):
    employee_name: Optional[str] = None
    department: Optional[str] = None
    issue_category: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    resolution_notes: Optional[str] = None

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v):
        if v is not None and v not in VALID_PRIORITIES:
            raise ValueError(f"Priority must be one of {VALID_PRIORITIES}")
        return v

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        if v is not None and v not in VALID_STATUSES:
            raise ValueError(f"Status must be one of {VALID_STATUSES}")
        return v


class TicketResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    ticket_id: int
    employee_name: str
    department: str
    issue_category: str
    description: str
    priority: str
    status: str
    resolution_notes: Optional[str]
    created_at: Optional[datetime]
