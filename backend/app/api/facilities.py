from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models.database import get_db
from app.models.models import Facility, Resident
from pydantic import BaseModel

router = APIRouter()

class FacilityResponse(BaseModel):
    id: int
    name: str
    address: str
    capacity: int
    contact_number: str
    resident_count: int
    
    class Config:
        from_attributes = True

class FacilityStats(BaseModel):
    facility: FacilityResponse
    total_residents: int
    total_alerts: int
    alert_summary: dict

@router.get("/", response_model=List[FacilityResponse])
async def get_facilities(db: Session = Depends(get_db)):
    facilities = db.query(Facility).order_by(Facility.name.asc()).all()
    facility_responses = []
    
    for facility in facilities:
        resident_count = db.query(Resident).filter(
            Resident.facility_id == facility.id,
            Resident.is_active == True
        ).count()
        
        facility_response = FacilityResponse(
            id=facility.id,
            name=facility.name,
            address=facility.address,
            capacity=facility.capacity,
            contact_number=facility.contact_number,
            resident_count=resident_count
        )
        facility_responses.append(facility_response)
    
    return facility_responses

@router.get("/{facility_id}", response_model=FacilityResponse)
async def get_facility(facility_id: int, db: Session = Depends(get_db)):
    facility = db.query(Facility).filter(Facility.id == facility_id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    
    resident_count = db.query(Resident).filter(
        Resident.facility_id == facility_id,
        Resident.is_active == True
    ).count()
    
    return FacilityResponse(
        id=facility.id,
        name=facility.name,
        address=facility.address,
        capacity=facility.capacity,
        contact_number=facility.contact_number,
        resident_count=resident_count
    )