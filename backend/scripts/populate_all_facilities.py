#!/usr/bin/env python3
"""
Populate all facilities with at least 40 residents and comprehensive data
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
import random
from app.models.models import Facility, Resident, Vitals, Alert, AlertSeverity
from app.models.database import Base

DATABASE_URL = "sqlite:///senior_care.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Indian names for residents
FIRST_NAMES = [
    "Arjun", "Priya", "Ravi", "Anita", "Suresh", "Kavita", "Vijay", "Meera",
    "Rajesh", "Sunita", "Ashok", "Geeta", "Anil", "Radha", "Prakash", "Usha",
    "Mahesh", "Savita", "Dinesh", "Rekha", "Satish", "Nirmala", "Vinod", "Kamini",
    "Harish", "Veena", "Deepak", "Asha", "Naresh", "Sudha", "Prem", "Kamal",
    "Jagdish", "Rita", "Om", "Shanti", "Mohan", "Lata", "Gopal", "Madhuri",
    "Sanjay", "Kiran", "Ramesh", "Pushpa", "Sunil", "Anjali", "Vikram", "Sarla"
]

LAST_NAMES = [
    "Sharma", "Gupta", "Patel", "Singh", "Kumar", "Reddy", "Rao", "Nair",
    "Menon", "Iyer", "Desai", "Joshi", "Verma", "Bhatt", "Malhotra", "Krishnan",
    "Agarwal", "Sinha", "Bose", "Pandey", "Banerjee", "Chopra", "Saxena", "Nath",
    "Pillai", "Kaul", "Das", "Tiwari", "Shah", "Mehta", "Kulkarni", "Bhatia",
    "Jain", "Roy", "Ahuja", "Mishra", "Kapoor", "Batra", "Acharya", "Fernandes"
]

MEDICAL_CONDITIONS = [
    "Diabetes Type 2, Hypertension",
    "Arthritis, Osteoporosis",
    "Cardiac arrhythmia, Anticoagulation therapy",
    "Alzheimer's disease, Behavioral management",
    "Parkinson's disease, Fall risk",
    "COPD, Oxygen therapy",
    "Chronic kidney disease, Dialysis",
    "Stroke recovery, Physical therapy",
    "Depression, Anxiety disorder",
    "Dementia, Memory care",
    "Heart failure, Fluid restriction",
    "Asthma, Allergies",
    "Thyroid disorder, Weight management",
    "Glaucoma, Visual impairment",
    "Hearing loss, Communication assistance",
    "Osteoarthritis, Chronic pain management",
    "Cancer survivor, Immunosuppression",
    "Rheumatoid arthritis, Joint protection",
    "Mild cognitive impairment, Orientation therapy",
    "Peripheral neuropathy, Balance training"
]

def generate_resident_name():
    """Generate a random Indian name"""
    return f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"

def populate_facility_residents(db, facility_id, facility_name, target_count=40):
    """Add residents to a facility to reach target count"""
    
    # Get current resident count
    current_count = db.query(Resident).filter_by(facility_id=facility_id).count()
    
    if current_count >= target_count:
        print(f"  ✓ {facility_name} already has {current_count} residents")
        return []
    
    residents_to_add = target_count - current_count
    print(f"  → Adding {residents_to_add} residents to {facility_name} (currently has {current_count})")
    
    # Get existing room numbers to avoid duplicates
    existing_rooms = db.query(Resident.room_number).filter_by(facility_id=facility_id).all()
    existing_rooms = [r[0] for r in existing_rooms]
    
    new_residents = []
    room_base = 100 * (facility_id % 10) if facility_id < 10 else 100  # Different room ranges per facility
    
    for i in range(residents_to_add):
        # Generate unique room number
        room_num = room_base + current_count + i + 1
        while str(room_num) in existing_rooms:
            room_num += 1
        
        resident = Resident(
            facility_id=facility_id,
            name=generate_resident_name(),
            age=random.randint(65, 92),
            room_number=str(room_num),
            medical_history=random.choice(MEDICAL_CONDITIONS),
            emergency_contact=f"+91-{random.randint(70000, 99999)}-{random.randint(10000, 99999)}",
            emergency_contact_name=generate_resident_name(),
            admission_date=datetime.utcnow() - timedelta(days=random.randint(30, 365))
        )
        db.add(resident)
        new_residents.append(resident)
    
    db.commit()
    print(f"    ✅ Added {len(new_residents)} residents")
    return new_residents

def generate_vitals_for_residents(db, residents):
    """Generate vitals data for residents"""
    if not residents:
        return 0
    
    vitals_count = 0
    for resident in residents:
        # Generate 30 days of vitals data
        for day in range(30):
            # 2-3 readings per day
            for _ in range(random.randint(2, 3)):
                vital_time = datetime.utcnow() - timedelta(days=day, hours=random.randint(6, 20))
                
                # Generate realistic vital signs
                is_diabetic = "Diabetes" in resident.medical_history
                has_hypertension = "Hypertension" in resident.medical_history or "Cardiac" in resident.medical_history
                
                vital = Vitals(
                    resident_id=resident.id,
                    blood_pressure_systolic=random.randint(130, 180) if has_hypertension else random.randint(110, 140),
                    blood_pressure_diastolic=random.randint(80, 110) if has_hypertension else random.randint(70, 90),
                    heart_rate=random.randint(60, 100),
                    temperature=round(random.uniform(97.0, 99.0), 1),
                    spo2=random.randint(94, 100),
                    respiratory_rate=random.randint(12, 20),
                    timestamp=vital_time
                )
                db.add(vital)
                vitals_count += 1
    
    db.commit()
    return vitals_count

def generate_alerts_for_residents(db, residents):
    """Generate alerts for residents"""
    if not residents:
        return 0
    
    alert_types = [
        "HIGH_BLOOD_PRESSURE",
        "LOW_OXYGEN",
        "IRREGULAR_HEART_RATE", 
        "HIGH_TEMPERATURE",
        "FALL_DETECTED",
        "MEDICATION_MISSED",
        "URGENT_CARE_NEEDED",
        "ABNORMAL_GLUCOSE"
    ]
    
    alerts_count = 0
    for resident in residents:
        # Generate 3-10 alerts per resident over 30 days
        num_alerts = random.randint(3, 10)
        
        for _ in range(num_alerts):
            days_ago = random.randint(0, 30)
            
            # Higher severity for certain conditions
            if "Alzheimer" in resident.medical_history or "Dementia" in resident.medical_history:
                severity = random.choice([AlertSeverity.MEDIUM, AlertSeverity.HIGH, AlertSeverity.CRITICAL])
            elif "Cardiac" in resident.medical_history or "Heart" in resident.medical_history:
                severity = random.choice([AlertSeverity.MEDIUM, AlertSeverity.HIGH])
            else:
                severity = random.choice([AlertSeverity.LOW, AlertSeverity.MEDIUM, AlertSeverity.HIGH])
            
            alert_type = random.choice(alert_types)
            
            # Generate appropriate message
            messages = {
                "HIGH_BLOOD_PRESSURE": f"Blood pressure elevated: {random.randint(160, 200)}/{random.randint(95, 120)}",
                "LOW_OXYGEN": f"SpO2 level dropped to {random.randint(85, 93)}%",
                "IRREGULAR_HEART_RATE": f"Heart rate irregular: {random.randint(40, 150)} bpm",
                "HIGH_TEMPERATURE": f"Temperature elevated: {round(random.uniform(99.5, 102.0), 1)}°F",
                "FALL_DETECTED": "Fall detected by monitoring system",
                "MEDICATION_MISSED": "Scheduled medication not taken",
                "URGENT_CARE_NEEDED": "Resident requires immediate attention",
                "ABNORMAL_GLUCOSE": f"Blood glucose level: {random.randint(50, 300)} mg/dL"
            }
            
            alert = Alert(
                resident_id=resident.id,
                type=alert_type,
                severity=severity,
                message=messages.get(alert_type, f"Alert for {resident.name}"),
                resolved=random.choice([True, False]) if days_ago > 2 else False,
                timestamp=datetime.utcnow() - timedelta(days=days_ago, hours=random.randint(0, 23))
            )
            
            if alert.resolved:
                alert.resolved_at = alert.timestamp + timedelta(hours=random.randint(1, 24))
            
            db.add(alert)
            alerts_count += 1
    
    db.commit()
    return alerts_count

def main():
    db = SessionLocal()
    
    try:
        print("🏥 Populating all facilities with comprehensive data...\n")
        
        # Get all facilities
        facilities = db.query(Facility).all()
        
        total_new_residents = 0
        total_new_vitals = 0
        total_new_alerts = 0
        
        for facility in facilities:
            print(f"\n📍 Processing {facility.name} (ID: {facility.id})")
            
            # Add residents to reach 40
            new_residents = populate_facility_residents(db, facility.id, facility.name, target_count=40)
            total_new_residents += len(new_residents)
            
            # Generate vitals for new residents
            if new_residents:
                vitals_count = generate_vitals_for_residents(db, new_residents)
                print(f"    ✅ Generated {vitals_count} vital records")
                total_new_vitals += vitals_count
                
                # Generate alerts for new residents
                alerts_count = generate_alerts_for_residents(db, new_residents)
                print(f"    ✅ Generated {alerts_count} alerts")
                total_new_alerts += alerts_count
        
        print("\n" + "="*60)
        print("✨ Population Complete!")
        print("="*60)
        print(f"  • New Residents Added: {total_new_residents}")
        print(f"  • New Vital Records: {total_new_vitals}")
        print(f"  • New Alerts: {total_new_alerts}")
        
        # Show final counts
        print("\n📊 Final Database Statistics:")
        for facility in facilities:
            resident_count = db.query(Resident).filter_by(facility_id=facility.id).count()
            print(f"  • {facility.name}: {resident_count} residents")
        
        total_residents = db.query(Resident).count()
        total_vitals = db.query(Vitals).count()
        total_alerts = db.query(Alert).count()
        
        print(f"\n  Total Residents: {total_residents}")
        print(f"  Total Vitals: {total_vitals}")
        print(f"  Total Alerts: {total_alerts}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()