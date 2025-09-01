from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List, Optional
from app.models.database import get_db
from app.models.models import Vitals, Resident
from app.services.anomaly_detection import check_vital_anomalies
from pydantic import BaseModel
from datetime import datetime, timedelta

router = APIRouter()

class VitalsCreate(BaseModel):
    resident_id: int
    heart_rate: float
    blood_pressure_systolic: float
    blood_pressure_diastolic: float
    temperature: float
    spo2: float
    respiratory_rate: float

class VitalsResponse(BaseModel):
    id: int
    resident_id: int
    timestamp: datetime
    heart_rate: float
    blood_pressure_systolic: float
    blood_pressure_diastolic: float
    temperature: float
    spo2: float
    respiratory_rate: float
    
    class Config:
        from_attributes = True

@router.post("/", response_model=VitalsResponse)
async def create_vitals(vitals: VitalsCreate, db: Session = Depends(get_db)):
    resident = db.query(Resident).filter(Resident.id == vitals.resident_id).first()
    if not resident:
        raise HTTPException(status_code=404, detail="Resident not found")
    
    db_vitals = Vitals(**vitals.dict())
    db.add(db_vitals)
    db.commit()
    db.refresh(db_vitals)
    
    anomalies = check_vital_anomalies(db_vitals, db)
    
    return db_vitals

@router.get("/resident/{resident_id}", response_model=List[VitalsResponse])
async def get_resident_vitals(
    resident_id: int,
    hours: Optional[int] = 24,
    db: Session = Depends(get_db)
):
    since = datetime.utcnow() - timedelta(hours=hours)
    vitals = db.query(Vitals).filter(
        Vitals.resident_id == resident_id,
        Vitals.timestamp >= since
    ).order_by(Vitals.timestamp.desc()).all()
    return vitals

@router.get("/latest", response_model=List[VitalsResponse])
async def get_latest_vitals(db: Session = Depends(get_db)):
    subquery = db.query(
        Vitals.resident_id,
        func.max(Vitals.timestamp).label("max_timestamp")
    ).group_by(Vitals.resident_id).subquery()
    
    latest_vitals = db.query(Vitals).join(
        subquery,
        and_(
            Vitals.resident_id == subquery.c.resident_id,
            Vitals.timestamp == subquery.c.max_timestamp
        )
    ).all()
    
    return latest_vitals