from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, JSON, Enum, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.database import Base
import enum

class AuditLogType(str, enum.Enum):
    LOGIN = "login"
    LOGOUT = "logout"
    VIEW_RESIDENT = "view_resident"
    EDIT_RESIDENT = "edit_resident"
    VIEW_VITALS = "view_vitals"
    ADD_VITALS = "add_vitals"
    VIEW_ALERTS = "view_alerts"
    RESOLVE_ALERT = "resolve_alert"
    VIEW_MEDICATION = "view_medication"
    ADMINISTER_MEDICATION = "administer_medication"
    INCIDENT_REPORT = "incident_report"
    EMERGENCY_CALL = "emergency_call"
    FAMILY_COMMUNICATION = "family_communication"
    DOCUMENT_ACCESS = "document_access"
    SYSTEM_EXPORT = "system_export"
    SETTINGS_CHANGE = "settings_change"

class ComplianceType(str, enum.Enum):
    HIPAA = "hipaa"
    STATE_HEALTH = "state_health"
    CMS = "cms"
    FIRE_SAFETY = "fire_safety"
    MEDICATION = "medication"
    STAFFING = "staffing"
    QUALITY_MEASURES = "quality_measures"

class IncidentSeverity(str, enum.Enum):
    MINOR = "minor"
    MODERATE = "moderate"
    MAJOR = "major"
    CRITICAL = "critical"

class DocumentType(str, enum.Enum):
    CARE_PLAN = "care_plan"
    MEDICATION_RECORD = "medication_record"
    INCIDENT_REPORT = "incident_report"
    ASSESSMENT = "assessment"
    FAMILY_COMMUNICATION = "family_communication"
    CONSENT_FORM = "consent_form"
    DISCHARGE_SUMMARY = "discharge_summary"
    INSURANCE_DOCUMENT = "insurance_document"

# Comprehensive Audit Trail System
class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action_type = Column(Enum(AuditLogType), nullable=False)
    resource_type = Column(String(50))  # resident, alert, medication, etc.
    resource_id = Column(Integer)  # ID of the resource being accessed
    timestamp = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String(45))  # IPv6 support
    user_agent = Column(Text)
    session_id = Column(String(255))
    details = Column(JSON)  # Additional context data
    before_data = Column(JSON)  # Data before change (for edits)
    after_data = Column(JSON)  # Data after change (for edits)
    risk_score = Column(Integer, default=0)  # 0-100 risk assessment
    requires_review = Column(Boolean, default=False)
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    
    facility = relationship("Facility")
    user = relationship("User", foreign_keys=[user_id])
    reviewer = relationship("User", foreign_keys=[reviewed_by])

# Family Subscription System
class FamilySubscription(Base):
    __tablename__ = "family_subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=False)
    family_member_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resident_id = Column(Integer, ForeignKey("residents.id"), nullable=False)
    subscription_type = Column(String(20))  # basic, premium, enterprise
    monthly_fee = Column(Float)
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    auto_renewal = Column(Boolean, default=True)
    payment_method_id = Column(String(100))  # Stripe/Razorpay payment method
    last_payment_date = Column(DateTime)
    next_billing_date = Column(DateTime)
    
    facility = relationship("Facility")
    family_member = relationship("User")
    resident = relationship("Resident")

# Incident Management System
class IncidentReport(Base):
    __tablename__ = "incident_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=False)
    resident_id = Column(Integer, ForeignKey("residents.id"), nullable=True)
    reported_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    incident_type = Column(String(50))  # fall, medication_error, behavioral, etc.
    severity = Column(Enum(IncidentSeverity), nullable=False)
    incident_date = Column(DateTime, nullable=False)
    location = Column(String(100))  # room, dining hall, etc.
    description = Column(Text, nullable=False)
    immediate_actions = Column(Text)  # What was done immediately
    witnesses = Column(JSON)  # List of witness IDs and names
    photos = Column(JSON)  # Photo URLs/paths
    videos = Column(JSON)  # Video URLs/paths
    family_notified = Column(Boolean, default=False)
    family_notification_time = Column(DateTime)
    doctor_notified = Column(Boolean, default=False)
    doctor_notification_time = Column(DateTime)
    external_agencies_notified = Column(JSON)  # Police, hospital, etc.
    follow_up_required = Column(Boolean, default=False)
    follow_up_notes = Column(Text)
    closed_date = Column(DateTime)
    closed_by = Column(Integer, ForeignKey("users.id"))
    regulatory_reporting_required = Column(Boolean, default=False)
    regulatory_reported_date = Column(DateTime)
    
    facility = relationship("Facility")
    resident = relationship("Resident")
    reporter = relationship("User", foreign_keys=[reported_by])
    closer = relationship("User", foreign_keys=[closed_by])

# Compliance Reporting System
class ComplianceReport(Base):
    __tablename__ = "compliance_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=False)
    compliance_type = Column(Enum(ComplianceType), nullable=False)
    report_period_start = Column(DateTime, nullable=False)
    report_period_end = Column(DateTime, nullable=False)
    generated_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    generated_date = Column(DateTime, default=datetime.utcnow)
    report_data = Column(JSON, nullable=False)  # Complete report data
    metrics = Column(JSON)  # Key metrics summary
    violations_count = Column(Integer, default=0)
    compliance_score = Column(Float)  # 0-100 compliance percentage
    recommendations = Column(JSON)  # AI-generated recommendations
    submitted_to_authority = Column(Boolean, default=False)
    submission_date = Column(DateTime)
    authority_response = Column(Text)
    
    facility = relationship("Facility")
    generator = relationship("User")

# Documentation System
class CareDocument(Base):
    __tablename__ = "care_documents"
    
    id = Column(Integer, primary_key=True, index=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=False)
    resident_id = Column(Integer, ForeignKey("residents.id"), nullable=False)
    document_type = Column(Enum(DocumentType), nullable=False)
    title = Column(String(200), nullable=False)
    content = Column(Text)
    file_path = Column(String(500))  # Path to uploaded file
    file_size = Column(Integer)
    mime_type = Column(String(100))
    version = Column(Integer, default=1)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_date = Column(DateTime, default=datetime.utcnow)
    last_modified_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    last_modified_date = Column(DateTime, default=datetime.utcnow)
    digital_signature = Column(Text)  # Cryptographic signature
    requires_family_consent = Column(Boolean, default=False)
    family_consent_obtained = Column(Boolean, default=False)
    family_consent_date = Column(DateTime)
    retention_period_months = Column(Integer, default=84)  # 7 years default
    is_confidential = Column(Boolean, default=True)
    tags = Column(JSON)  # Searchable tags
    
    facility = relationship("Facility")
    resident = relationship("Resident")
    creator = relationship("User", foreign_keys=[created_by])
    modifier = relationship("User", foreign_keys=[last_modified_by])

# Medication Administration Records (MAR)
class MedicationAdministration(Base):
    __tablename__ = "medication_administrations"
    
    id = Column(Integer, primary_key=True, index=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=False)
    resident_id = Column(Integer, ForeignKey("residents.id"), nullable=False)
    medication_name = Column(String(200), nullable=False)
    dosage = Column(String(100), nullable=False)
    route = Column(String(50))  # oral, injection, etc.
    scheduled_time = Column(DateTime, nullable=False)
    administered_time = Column(DateTime)
    administered_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    administered_dose = Column(String(100))  # Actual dose given
    administration_notes = Column(Text)
    side_effects_observed = Column(Text)
    refused_by_resident = Column(Boolean, default=False)
    refusal_reason = Column(Text)
    photo_verification = Column(String(500))  # Photo of medication
    witnessed_by = Column(Integer, ForeignKey("users.id"))
    
    facility = relationship("Facility")
    resident = relationship("Resident")
    administrator = relationship("User", foreign_keys=[administered_by])
    witness = relationship("User", foreign_keys=[witnessed_by])

# Family Communication Log
class FamilyCommunication(Base):
    __tablename__ = "family_communications"
    
    id = Column(Integer, primary_key=True, index=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=False)
    resident_id = Column(Integer, ForeignKey("residents.id"), nullable=False)
    family_member_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    staff_member_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    communication_type = Column(String(50))  # phone, email, video_call, in_person
    communication_date = Column(DateTime, default=datetime.utcnow)
    subject = Column(String(200))
    content = Column(Text, nullable=False)
    attachments = Column(JSON)  # File attachments
    read_by_family = Column(Boolean, default=False)
    read_timestamp = Column(DateTime)
    response_required = Column(Boolean, default=False)
    response_deadline = Column(DateTime)
    response_content = Column(Text)
    response_timestamp = Column(DateTime)
    satisfaction_rating = Column(Integer)  # 1-5 family satisfaction
    
    facility = relationship("Facility")
    resident = relationship("Resident")
    family_member = relationship("User", foreign_keys=[family_member_id])
    staff_member = relationship("User", foreign_keys=[staff_member_id])

# ROI Metrics Tracking
class ROIMetric(Base):
    __tablename__ = "roi_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=False)
    metric_date = Column(DateTime, default=datetime.utcnow)
    metric_type = Column(String(50))  # emergency_prevented, staff_efficiency, etc.
    baseline_value = Column(Float)
    current_value = Column(Float)
    cost_savings = Column(Float)
    efficiency_gain = Column(Float)  # Percentage
    details = Column(JSON)
    calculation_method = Column(Text)
    verified_by = Column(Integer, ForeignKey("users.id"))
    
    facility = relationship("Facility")
    verifier = relationship("User")

# Quality Measures for CMS Compliance
class QualityMeasure(Base):
    __tablename__ = "quality_measures"
    
    id = Column(Integer, primary_key=True, index=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=False)
    measure_code = Column(String(20))  # CMS quality measure codes
    measure_name = Column(String(200))
    reporting_period_start = Column(DateTime)
    reporting_period_end = Column(DateTime)
    numerator = Column(Integer)
    denominator = Column(Integer)
    rate = Column(Float)  # Performance rate
    target_rate = Column(Float)  # Target performance rate
    percentile_rank = Column(Integer)  # National percentile
    improvement_actions = Column(JSON)
    
    facility = relationship("Facility")