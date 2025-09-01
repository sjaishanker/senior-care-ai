from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from app.models.database import get_db
from app.models.models import User, Facility, Resident
from app.models.compliance_models import (
    AuditLog, AuditLogType, IncidentReport, IncidentSeverity,
    ComplianceReport, ComplianceType, CareDocument, DocumentType,
    MedicationAdministration, FamilyCommunication, ROIMetric,
    QualityMeasure, FamilySubscription
)
from app.services.audit_service import AuditService, HIPAAComplianceChecker
from app.api.auth import get_current_user
from pydantic import BaseModel, EmailStr
import json

router = APIRouter()

# Pydantic models for API responses
class AuditLogResponse(BaseModel):
    id: int
    user_id: int
    action_type: str
    resource_type: Optional[str]
    resource_id: Optional[int]
    timestamp: datetime
    ip_address: Optional[str]
    risk_score: int
    requires_review: bool
    
    class Config:
        from_attributes = True

class IncidentReportCreate(BaseModel):
    resident_id: Optional[int]
    incident_type: str
    severity: IncidentSeverity
    incident_date: datetime
    location: str
    description: str
    immediate_actions: Optional[str]
    witnesses: Optional[List[Dict[str, Any]]] = []
    photos: Optional[List[str]] = []

class IncidentReportResponse(BaseModel):
    id: int
    resident_id: Optional[int]
    incident_type: str
    severity: IncidentSeverity
    incident_date: datetime
    location: str
    description: str
    family_notified: bool
    doctor_notified: bool
    closed_date: Optional[datetime]
    regulatory_reporting_required: bool
    
    class Config:
        from_attributes = True

class ComplianceReportResponse(BaseModel):
    id: int
    compliance_type: ComplianceType
    report_period_start: datetime
    report_period_end: datetime
    compliance_score: Optional[float]
    violations_count: int
    metrics: Optional[Dict[str, Any]]
    
    class Config:
        from_attributes = True

class ROIMetricCreate(BaseModel):
    metric_type: str
    baseline_value: float
    current_value: float
    cost_savings: float
    efficiency_gain: float
    details: Optional[Dict[str, Any]]

class FamilySubscriptionCreate(BaseModel):
    resident_id: int
    subscription_type: str  # basic, premium, enterprise
    auto_renewal: bool = True

class MedicationAdministrationCreate(BaseModel):
    resident_id: int
    medication_name: str
    dosage: str
    route: str
    scheduled_time: datetime
    administered_dose: str
    administration_notes: Optional[str]
    side_effects_observed: Optional[str]
    refused_by_resident: bool = False
    refusal_reason: Optional[str]

# Audit Log Endpoints
@router.get("/audit-logs", response_model=List[AuditLogResponse])
async def get_audit_logs(
    facility_id: Optional[int] = None,
    user_id: Optional[int] = None,
    action_type: Optional[AuditLogType] = None,
    high_risk_only: bool = False,
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get audit logs with filtering options"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    query = db.query(AuditLog).filter(AuditLog.timestamp >= start_date)
    
    if facility_id:
        query = query.filter(AuditLog.facility_id == facility_id)
    elif current_user.facility_id:
        query = query.filter(AuditLog.facility_id == current_user.facility_id)
    
    if user_id:
        query = query.filter(AuditLog.user_id == user_id)
    
    if action_type:
        query = query.filter(AuditLog.action_type == action_type)
    
    if high_risk_only:
        query = query.filter(AuditLog.risk_score > 70)
    
    return query.order_by(AuditLog.timestamp.desc()).limit(1000).all()

@router.get("/audit-summary")
async def get_audit_summary(
    facility_id: Optional[int] = None,
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get audit summary for compliance dashboard"""
    effective_facility_id = facility_id or current_user.facility_id
    
    audit_service = AuditService(db)
    summary = audit_service.get_facility_compliance_summary(effective_facility_id, days)
    
    return summary

# Incident Reporting System
@router.post("/incidents", response_model=IncidentReportResponse)
async def create_incident_report(
    incident: IncidentReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new incident report"""
    db_incident = IncidentReport(
        facility_id=current_user.facility_id,
        resident_id=incident.resident_id,
        reported_by=current_user.id,
        incident_type=incident.incident_type,
        severity=incident.severity,
        incident_date=incident.incident_date,
        location=incident.location,
        description=incident.description,
        immediate_actions=incident.immediate_actions,
        witnesses=incident.witnesses,
        photos=incident.photos,
        regulatory_reporting_required=incident.severity in [IncidentSeverity.MAJOR, IncidentSeverity.CRITICAL]
    )
    
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    
    # Log the incident report creation
    audit_service = AuditService(db)
    audit_service.log_action(
        user_id=current_user.id,
        facility_id=current_user.facility_id,
        action_type=AuditLogType.INCIDENT_REPORT,
        resource_type="incident",
        resource_id=db_incident.id,
        details={"incident_type": incident.incident_type, "severity": incident.severity.value}
    )
    
    return db_incident

@router.get("/incidents", response_model=List[IncidentReportResponse])
async def get_incident_reports(
    facility_id: Optional[int] = None,
    resident_id: Optional[int] = None,
    severity: Optional[IncidentSeverity] = None,
    days: int = 90,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get incident reports with filtering"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    query = db.query(IncidentReport).filter(IncidentReport.incident_date >= start_date)
    
    effective_facility_id = facility_id or current_user.facility_id
    query = query.filter(IncidentReport.facility_id == effective_facility_id)
    
    if resident_id:
        query = query.filter(IncidentReport.resident_id == resident_id)
    
    if severity:
        query = query.filter(IncidentReport.severity == severity)
    
    return query.order_by(IncidentReport.incident_date.desc()).all()

@router.put("/incidents/{incident_id}/close")
async def close_incident_report(
    incident_id: int,
    follow_up_notes: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Close an incident report"""
    incident = db.query(IncidentReport).filter(IncidentReport.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    incident.closed_date = datetime.utcnow()
    incident.closed_by = current_user.id
    incident.follow_up_notes = follow_up_notes
    
    db.commit()
    
    return {"message": "Incident closed successfully"}

# Compliance Reporting
@router.post("/compliance-reports")
async def generate_compliance_report(
    compliance_type: ComplianceType,
    period_start: datetime,
    period_end: datetime,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate a compliance report"""
    # Gather relevant data based on compliance type
    report_data = {}
    violations_count = 0
    compliance_score = 100.0
    
    if compliance_type == ComplianceType.HIPAA:
        # HIPAA compliance data
        audit_logs = db.query(AuditLog).filter(
            AuditLog.facility_id == current_user.facility_id,
            AuditLog.timestamp.between(period_start, period_end),
            AuditLog.risk_score > 70
        ).all()
        
        violations_count = len(audit_logs)
        compliance_score = max(0, 100 - violations_count * 2)
        
        report_data = {
            "high_risk_accesses": violations_count,
            "unauthorized_attempts": sum(1 for log in audit_logs if log.risk_score > 90),
            "data_exports": sum(1 for log in audit_logs if log.action_type == AuditLogType.SYSTEM_EXPORT)
        }
    
    elif compliance_type == ComplianceType.MEDICATION:
        # Medication compliance data
        med_records = db.query(MedicationAdministration).filter(
            MedicationAdministration.facility_id == current_user.facility_id,
            MedicationAdministration.scheduled_time.between(period_start, period_end)
        ).all()
        
        total_scheduled = len(med_records)
        administered_on_time = sum(1 for med in med_records 
                                 if med.administered_time and 
                                 abs((med.administered_time - med.scheduled_time).total_seconds()) < 1800)  # 30 min window
        
        compliance_score = (administered_on_time / total_scheduled * 100) if total_scheduled > 0 else 100
        
        report_data = {
            "total_scheduled_medications": total_scheduled,
            "administered_on_time": administered_on_time,
            "compliance_percentage": compliance_score
        }
    
    # Create compliance report
    db_report = ComplianceReport(
        facility_id=current_user.facility_id,
        compliance_type=compliance_type,
        report_period_start=period_start,
        report_period_end=period_end,
        generated_by=current_user.id,
        report_data=report_data,
        violations_count=violations_count,
        compliance_score=compliance_score
    )
    
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    
    return db_report

@router.get("/compliance-reports", response_model=List[ComplianceReportResponse])
async def get_compliance_reports(
    compliance_type: Optional[ComplianceType] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get compliance reports"""
    query = db.query(ComplianceReport).filter(
        ComplianceReport.facility_id == current_user.facility_id
    )
    
    if compliance_type:
        query = query.filter(ComplianceReport.compliance_type == compliance_type)
    
    return query.order_by(ComplianceReport.generated_date.desc()).all()

# Family Subscription System
@router.get("/family-subscriptions")
async def get_family_subscriptions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get family subscriptions"""
    if current_user.role.value == 'family':
        # Family members see only their own subscriptions
        subscriptions = db.query(FamilySubscription).filter(
            FamilySubscription.family_member_id == current_user.id,
            FamilySubscription.is_active == True
        ).all()
    else:
        # Staff/admin see all subscriptions for their facility
        subscriptions = db.query(FamilySubscription).filter(
            FamilySubscription.facility_id == current_user.facility_id,
            FamilySubscription.is_active == True
        ).all()
    
    return subscriptions

@router.post("/family-subscriptions")
async def create_family_subscription(
    subscription: FamilySubscriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create family subscription"""
    # Pricing based on subscription type
    pricing = {
        "basic": 10.0,
        "premium": 25.0,
        "enterprise": 50.0
    }
    
    monthly_fee = pricing.get(subscription.subscription_type, 10.0)
    
    db_subscription = FamilySubscription(
        facility_id=current_user.facility_id,
        family_member_id=current_user.id,
        resident_id=subscription.resident_id,
        subscription_type=subscription.subscription_type,
        monthly_fee=monthly_fee,
        auto_renewal=subscription.auto_renewal,
        next_billing_date=datetime.utcnow() + timedelta(days=30)
    )
    
    db.add(db_subscription)
    db.commit()
    db.refresh(db_subscription)
    
    return db_subscription

# ROI Metrics
@router.post("/roi-metrics")
async def create_roi_metric(
    metric: ROIMetricCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add ROI metric"""
    db_metric = ROIMetric(
        facility_id=current_user.facility_id,
        metric_type=metric.metric_type,
        baseline_value=metric.baseline_value,
        current_value=metric.current_value,
        cost_savings=metric.cost_savings,
        efficiency_gain=metric.efficiency_gain,
        details=metric.details,
        verified_by=current_user.id
    )
    
    db.add(db_metric)
    db.commit()
    db.refresh(db_metric)
    
    return db_metric

@router.get("/roi-summary")
async def get_roi_summary(
    days: int = 90,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get ROI summary for dashboard"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    metrics = db.query(ROIMetric).filter(
        ROIMetric.facility_id == current_user.facility_id,
        ROIMetric.metric_date >= start_date
    ).all()
    
    total_cost_savings = sum(m.cost_savings for m in metrics)
    avg_efficiency_gain = sum(m.efficiency_gain for m in metrics) / len(metrics) if metrics else 0
    
    # Calculate specific metrics
    emergency_prevented = sum(1 for m in metrics if m.metric_type == "emergency_prevented")
    staff_efficiency_improvements = [m.efficiency_gain for m in metrics if m.metric_type == "staff_efficiency"]
    
    return {
        "total_cost_savings": total_cost_savings,
        "average_efficiency_gain": avg_efficiency_gain,
        "emergencies_prevented": emergency_prevented,
        "staff_efficiency_gain": sum(staff_efficiency_improvements) / len(staff_efficiency_improvements) if staff_efficiency_improvements else 0,
        "metrics_count": len(metrics)
    }

# Medication Administration Records
@router.post("/medication-administrations")
async def record_medication_administration(
    medication: MedicationAdministrationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Record medication administration"""
    db_med = MedicationAdministration(
        facility_id=current_user.facility_id,
        resident_id=medication.resident_id,
        medication_name=medication.medication_name,
        dosage=medication.dosage,
        route=medication.route,
        scheduled_time=medication.scheduled_time,
        administered_time=datetime.utcnow(),
        administered_by=current_user.id,
        administered_dose=medication.administered_dose,
        administration_notes=medication.administration_notes,
        side_effects_observed=medication.side_effects_observed,
        refused_by_resident=medication.refused_by_resident,
        refusal_reason=medication.refusal_reason
    )
    
    db.add(db_med)
    db.commit()
    db.refresh(db_med)
    
    # Log medication administration
    audit_service = AuditService(db)
    audit_service.log_action(
        user_id=current_user.id,
        facility_id=current_user.facility_id,
        action_type=AuditLogType.ADMINISTER_MEDICATION,
        resource_type="medication",
        resource_id=db_med.id,
        details={
            "medication": medication.medication_name,
            "resident_id": medication.resident_id,
            "refused": medication.refused_by_resident
        }
    )
    
    return db_med

@router.get("/medication-administrations")
async def get_medication_records(
    resident_id: Optional[int] = None,
    days: int = 7,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get medication administration records"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    query = db.query(MedicationAdministration).filter(
        MedicationAdministration.facility_id == current_user.facility_id,
        MedicationAdministration.scheduled_time >= start_date
    )
    
    if resident_id:
        query = query.filter(MedicationAdministration.resident_id == resident_id)
    
    return query.order_by(MedicationAdministration.scheduled_time.desc()).all()

# ROI Metrics endpoint
@router.get("/roi-metrics")
async def get_roi_metrics(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get ROI metrics for facility"""
    metrics = db.query(ROIMetric).filter(
        ROIMetric.facility_id == current_user.facility_id
    ).order_by(ROIMetric.metric_date.desc()).limit(limit).all()
    
    return metrics

# Family Stats endpoint
@router.get("/family-stats")
async def get_family_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get family portal statistics"""
    # Mock data for now - in production this would come from actual data
    return {
        "total_alerts_this_month": 3,
        "emergency_incidents": 0,
        "medication_adherence": 95,
        "family_satisfaction": 4.7,
        "last_communication": "2024-01-15T10:30:00"
    }

# Data Export with HIPAA Compliance
@router.get("/export-data")
async def export_facility_data(
    data_type: str,  # residents, incidents, medications, etc.
    anonymize: bool = True,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Export facility data with HIPAA compliance"""
    # Log data export attempt
    audit_service = AuditService(db)
    audit_service.log_action(
        user_id=current_user.id,
        facility_id=current_user.facility_id,
        action_type=AuditLogType.SYSTEM_EXPORT,
        details={
            "data_type": data_type,
            "anonymized": anonymize,
            "export_timestamp": datetime.utcnow().isoformat()
        }
    )
    
    export_data = {}
    
    if data_type == "residents":
        residents = db.query(Resident).filter(
            Resident.facility_id == current_user.facility_id
        ).all()
        
        export_data = [
            HIPAAComplianceChecker.anonymize_data_for_reporting({
                "id": r.id,
                "name": r.name,
                "age": r.age,
                "room_number": r.room_number,
                "medical_history": r.medical_history
            }) if anonymize else {
                "id": r.id,
                "name": r.name,
                "age": r.age,
                "room_number": r.room_number,
                "medical_history": r.medical_history
            }
            for r in residents
        ]
    
    return {
        "data_type": data_type,
        "export_date": datetime.utcnow(),
        "anonymized": anonymize,
        "record_count": len(export_data),
        "data": export_data
    }