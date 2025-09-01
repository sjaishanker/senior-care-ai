import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime, timedelta
import random
from faker import Faker
from app.models.database import SessionLocal
from app.models.models import Resident, Facility, Alert, AlertSeverity

fake = Faker('en_IN')
db = SessionLocal()

def generate_alerts_for_athulya():
    """Generate alerts for Athulya Senior Care residents"""
    
    # Find Athulya facility
    facility = db.query(Facility).filter(
        Facility.name == "Athulya Senior Care"
    ).first()
    
    if not facility:
        print("❌ Athulya Senior Care facility not found!")
        return
    
    print(f"✅ Found Athulya Senior Care (ID: {facility.id})")
    
    # Get all residents
    residents = db.query(Resident).filter(
        Resident.facility_id == facility.id
    ).all()
    
    print(f"👥 Found {len(residents)} residents")
    
    alerts = []
    
    alert_types = [
        ("High Blood Pressure", AlertSeverity.CRITICAL, "Blood pressure reading: {}/{}"),
        ("Low Oxygen Saturation", AlertSeverity.CRITICAL, "O2 saturation: {}%"),
        ("Fall Detected", AlertSeverity.CRITICAL, "Fall detected in {}"),
        ("Missed Medication", AlertSeverity.HIGH, "Missed {} dose"),
        ("Irregular Heart Rate", AlertSeverity.HIGH, "Heart rate: {} bpm"),
        ("High Blood Sugar", AlertSeverity.MEDIUM, "Blood glucose: {} mg/dL"),
        ("Temperature Anomaly", AlertSeverity.LOW, "Temperature: {}°F"),
        ("Weight Change", AlertSeverity.LOW, "Weight change of {} kg in past week"),
        ("Appointment Reminder", AlertSeverity.LOW, "Upcoming appointment: {}"),
        ("Medication Refill", AlertSeverity.LOW, "Medication {} needs refill")
    ]
    
    medications = [
        "Metformin", "Amlodipine", "Lisinopril", "Atorvastatin",
        "Aspirin", "Omeprazole", "Levothyroxine", "Metoprolol",
        "Gabapentin", "Losartan", "Insulin", "Furosemide"
    ]
    
    # Generate alerts for last 30 days
    for resident in residents:
        # Number of alerts per resident (0-10)
        num_alerts = random.randint(0, 10)
        
        for _ in range(num_alerts):
            alert_type, severity, message_template = random.choice(alert_types)
            alert_date = datetime.utcnow() - timedelta(days=random.randint(0, 30))
            
            # Format message based on alert type
            if "Blood pressure" in alert_type:
                systolic = random.randint(140, 180)
                diastolic = random.randint(90, 110)
                message = f"Blood pressure reading: {systolic}/{diastolic}"
            elif "O2 saturation" in alert_type:
                message = f"O2 saturation: {random.randint(88, 93)}%"
            elif "Fall" in alert_type:
                message = f"Fall detected in Room {resident.room_number}"
            elif "Missed Medication" in alert_type:
                med = random.choice(medications)
                message = f"Missed {med} dose"
            elif "Heart rate" in alert_type:
                hr = random.choice([random.randint(40, 55), random.randint(100, 120)])
                message = f"Heart rate: {hr} bpm"
            elif "Blood glucose" in alert_type:
                message = f"Blood glucose: {random.randint(180, 250)} mg/dL"
            elif "Temperature" in alert_type:
                temp = random.choice([random.uniform(96.0, 97.0), random.uniform(99.5, 101.0)])
                message = f"Temperature: {temp:.1f}°F"
            elif "Weight" in alert_type:
                change = random.uniform(-3, 3)
                message = f"Weight change of {change:.1f} kg in past week"
            elif "Appointment" in alert_type:
                dept = random.choice(["Cardiology", "Ophthalmology", "Dentist", "Podiatry"])
                message = f"Upcoming appointment: {dept}"
            else:  # Medication Refill
                med = random.choice(medications)
                message = f"Medication {med} needs refill"
            
            # Determine if resolved
            is_old = alert_date < datetime.utcnow() - timedelta(days=1)
            resolved = random.choice([True, False]) if is_old else False
            
            alert = Alert(
                resident_id=resident.id,
                type=alert_type,
                severity=severity,
                message=message,
                timestamp=alert_date,
                resolved=resolved,
                resolved_at=alert_date + timedelta(hours=random.randint(1, 24)) if resolved else None,
                resolved_by=None  # No user IDs to reference
            )
            alerts.append(alert)
    
    # Batch insert
    db.add_all(alerts)
    db.commit()
    
    print(f"✅ Created {len(alerts)} alerts for Athulya Senior Care")
    
    # Show summary
    unresolved_count = sum(1 for a in alerts if not a.resolved)
    critical_count = sum(1 for a in alerts if a.severity == AlertSeverity.CRITICAL)
    high_count = sum(1 for a in alerts if a.severity == AlertSeverity.HIGH)
    
    print(f"\n📊 Alert Summary:")
    print(f"   Total: {len(alerts)}")
    print(f"   Unresolved: {unresolved_count}")
    print(f"   Critical: {critical_count}")
    print(f"   High: {high_count}")

if __name__ == "__main__":
    try:
        generate_alerts_for_athulya()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()