from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.database import get_db
from app.models.models import Alert, AlertSeverity
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class AlertResponse(BaseModel):
    id: int
    resident_id: int
    type: str
    severity: AlertSeverity
    message: str
    timestamp: datetime
    resolved: bool
    resolved_at: Optional[datetime]
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[AlertResponse])
async def get_alerts(
    resolved: Optional[bool] = None,
    severity: Optional[AlertSeverity] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Alert)
    
    if resolved is not None:
        query = query.filter(Alert.resolved == resolved)
    
    if severity:
        query = query.filter(Alert.severity == severity)
    
    alerts = query.order_by(Alert.timestamp.desc()).limit(100).all()
    return alerts

@router.get("/resident/{resident_id}", response_model=List[AlertResponse])
async def get_resident_alerts(resident_id: int, db: Session = Depends(get_db)):
    alerts = db.query(Alert).filter(
        Alert.resident_id == resident_id
    ).order_by(Alert.timestamp.desc()).limit(50).all()
    return alerts

@router.put("/{alert_id}/resolve")
async def resolve_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.resolved = True
    alert.resolved_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Alert resolved successfully"}

@router.get("/active-count")
async def get_active_alert_count(facility_id: int = None, db: Session = Depends(get_db)):
    from app.models.models import Resident
    
    base_query = db.query(Alert).filter(Alert.resolved == False)
    
    if facility_id:
        base_query = base_query.join(Resident).filter(Resident.facility_id == facility_id)
    
    counts = {
        "critical": base_query.filter(Alert.severity == AlertSeverity.CRITICAL).count(),
        "high": base_query.filter(Alert.severity == AlertSeverity.HIGH).count(),
        "medium": base_query.filter(Alert.severity == AlertSeverity.MEDIUM).count(),
        "low": base_query.filter(Alert.severity == AlertSeverity.LOW).count(),
    }
    return counts