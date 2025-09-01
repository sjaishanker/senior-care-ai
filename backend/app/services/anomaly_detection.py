from app.models.models import Vitals, Alert, AlertSeverity
from sqlalchemy.orm import Session
from datetime import datetime

VITAL_THRESHOLDS = {
    "heart_rate": {"min": 60, "max": 100, "critical_min": 40, "critical_max": 120},
    "blood_pressure_systolic": {"min": 90, "max": 140, "critical_min": 80, "critical_max": 180},
    "blood_pressure_diastolic": {"min": 60, "max": 90, "critical_min": 50, "critical_max": 110},
    "temperature": {"min": 36.0, "max": 37.5, "critical_min": 35.0, "critical_max": 39.0},
    "spo2": {"min": 95, "max": 100, "critical_min": 90, "critical_max": 100},
    "respiratory_rate": {"min": 12, "max": 20, "critical_min": 8, "critical_max": 30}
}

def check_vital_anomalies(vitals: Vitals, db: Session):
    alerts = []
    
    if vitals.heart_rate:
        severity, message = check_threshold(
            vitals.heart_rate, 
            VITAL_THRESHOLDS["heart_rate"],
            "Heart rate"
        )
        if severity:
            alerts.append(create_alert(vitals.resident_id, "heart_rate", severity, message, db))
    
    if vitals.blood_pressure_systolic:
        severity, message = check_threshold(
            vitals.blood_pressure_systolic, 
            VITAL_THRESHOLDS["blood_pressure_systolic"],
            "Systolic BP"
        )
        if severity:
            alerts.append(create_alert(vitals.resident_id, "blood_pressure", severity, message, db))
    
    if vitals.temperature:
        severity, message = check_threshold(
            vitals.temperature, 
            VITAL_THRESHOLDS["temperature"],
            "Temperature"
        )
        if severity:
            alerts.append(create_alert(vitals.resident_id, "temperature", severity, message, db))
    
    if vitals.spo2:
        severity, message = check_threshold(
            vitals.spo2, 
            VITAL_THRESHOLDS["spo2"],
            "SpO2",
            reverse=True
        )
        if severity:
            alerts.append(create_alert(vitals.resident_id, "spo2", severity, message, db))
    
    return alerts

def check_threshold(value, thresholds, vital_name, reverse=False):
    if reverse:
        if value < thresholds["critical_min"]:
            return AlertSeverity.CRITICAL, f"{vital_name} critically low: {value}"
        elif value < thresholds["min"]:
            return AlertSeverity.HIGH, f"{vital_name} low: {value}"
    else:
        if value < thresholds["critical_min"] or value > thresholds["critical_max"]:
            return AlertSeverity.CRITICAL, f"{vital_name} critical: {value}"
        elif value < thresholds["min"] or value > thresholds["max"]:
            return AlertSeverity.HIGH, f"{vital_name} abnormal: {value}"
    
    return None, None

def create_alert(resident_id, alert_type, severity, message, db):
    alert = Alert(
        resident_id=resident_id,
        type=alert_type,
        severity=severity,
        message=message,
        timestamp=datetime.utcnow()
    )
    db.add(alert)
    db.commit()
    return alert