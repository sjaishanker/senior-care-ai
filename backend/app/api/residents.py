from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models.database import get_db
from app.models.models import Resident
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class ResidentCreate(BaseModel):
    name: str
    age: int
    room_number: str
    medical_history: str = ""
    emergency_contact: str
    emergency_contact_name: str
    facility_id: int

class ResidentResponse(BaseModel):
    id: int
    name: str
    age: int
    room_number: str
    medical_history: str
    emergency_contact: str
    emergency_contact_name: str
    facility_id: int
    admission_date: datetime
    is_active: bool
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[ResidentResponse])
async def get_residents(facility_id: int = None, db: Session = Depends(get_db)):
    query = db.query(Resident).filter(Resident.is_active == True)
    if facility_id:
        query = query.filter(Resident.facility_id == facility_id)
    residents = query.all()
    return residents

@router.get("/{resident_id}", response_model=ResidentResponse)
async def get_resident(resident_id: int, db: Session = Depends(get_db)):
    resident = db.query(Resident).filter(Resident.id == resident_id).first()
    if not resident:
        raise HTTPException(status_code=404, detail="Resident not found")
    return resident

@router.post("/", response_model=ResidentResponse)
async def create_resident(resident: ResidentCreate, db: Session = Depends(get_db)):
    db_resident = Resident(**resident.dict())
    db.add(db_resident)
    db.commit()
    db.refresh(db_resident)
    return db_resident

@router.put("/{resident_id}", response_model=ResidentResponse)
async def update_resident(resident_id: int, resident: ResidentCreate, db: Session = Depends(get_db)):
    db_resident = db.query(Resident).filter(Resident.id == resident_id).first()
    if not db_resident:
        raise HTTPException(status_code=404, detail="Resident not found")
    
    for key, value in resident.dict().items():
        setattr(db_resident, key, value)
    
    db.commit()
    db.refresh(db_resident)
    return db_resident

@router.delete("/{resident_id}")
async def delete_resident(resident_id: int, db: Session = Depends(get_db)):
    db_resident = db.query(Resident).filter(Resident.id == resident_id).first()
    if not db_resident:
        raise HTTPException(status_code=404, detail="Resident not found")
    
    db_resident.is_active = False
    db.commit()
    return {"message": "Resident deactivated successfully"}