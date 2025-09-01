import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime, timedelta
import random
from faker import Faker
from app.models.database import SessionLocal, engine
from app.models.models import Resident, Facility, Vitals, Alert, AlertSeverity
from sqlalchemy.orm import Session

fake = Faker('en_IN')  # Use Indian locale
db = SessionLocal()

def create_athulya_facility():
    """Create Athulya Senior Care facility"""
    facility = Facility(
        name="Athulya Senior Care",
        address="Plot No. 45, Sector 12, Whitefield, Bangalore, Karnataka - 560066",
        capacity=100,
        contact_number="+91 80 4567 8900",
        created_at=datetime.utcnow() - timedelta(days=365)
    )
    db.add(facility)
    db.commit()
    print(f"✅ Created facility: {facility.name}")
    return facility

def generate_residents(facility_id, count=80):
    """Generate 80 residents for Athulya Senior Care"""
    residents = []
    
    # Common medical conditions for elderly
    medical_conditions = [
        "Hypertension", "Diabetes Type 2", "Arthritis", "Osteoporosis",
        "Dementia", "Heart Disease", "COPD", "Parkinson's", "Alzheimer's",
        "Kidney Disease", "Vision Impairment", "Hearing Loss"
    ]
    
    # Common medications
    medications = [
        "Metformin", "Amlodipine", "Lisinopril", "Atorvastatin",
        "Aspirin", "Omeprazole", "Levothyroxine", "Metoprolol",
        "Gabapentin", "Losartan", "Insulin", "Furosemide"
    ]
    
    care_levels = ["Independent", "Assisted", "Memory Care", "Skilled Nursing"]
    blood_groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    
    for i in range(count):
        # Randomize gender
        gender = random.choice(["Male", "Female"])
        
        if gender == "Male":
            first_name = fake.first_name_male()
        else:
            first_name = fake.first_name_female()
        
        last_name = fake.last_name()
        
        # Age between 65 and 95
        age = random.randint(65, 95)
        
        # Admission date within last 2 years
        admission_date = datetime.utcnow() - timedelta(days=random.randint(30, 730))
        
        # Generate medical history
        num_conditions = random.randint(1, 4)
        resident_conditions = random.sample(medical_conditions, num_conditions)
        
        num_medications = random.randint(2, 6)
        resident_medications = random.sample(medications, num_medications)
        
        resident = Resident(
            name=f"{first_name} {last_name}",
            age=age,
            room_number=f"{random.randint(1, 4)}{str(i+1).zfill(2)}",
            medical_history=", ".join(resident_conditions) + f" | Medications: {', '.join(resident_medications)}",
            emergency_contact=fake.phone_number(),
            emergency_contact_name=fake.name(),
            facility_id=facility_id,
            admission_date=admission_date,
            is_active=True
        )
        residents.append(resident)
    
    db.add_all(residents)
    db.commit()
    print(f"✅ Created {count} residents")
    return residents

def generate_vitals_data(residents, days=35):
    """Generate 30-45 days of vitals data for each resident"""
    vitals_records = []
    
    for resident in residents:
        # Randomize number of days between 30-45
        actual_days = random.randint(30, 45)
        
        # Set baseline vitals based on age and conditions
        has_hypertension = "Hypertension" in (resident.medical_history or "")
        has_diabetes = "Diabetes" in (resident.medical_history or "")
        
        # Baseline values
        baseline_systolic = 130 if has_hypertension else 120
        baseline_diastolic = 85 if has_hypertension else 80
        baseline_heart_rate = random.randint(65, 75)
        baseline_temp = 98.6
        baseline_oxygen = random.randint(95, 98)
        baseline_glucose = 140 if has_diabetes else 100
        
        for day in range(actual_days):
            measurement_date = datetime.utcnow() - timedelta(days=actual_days-day)
            
            # Morning vitals (around 8 AM)
            morning_vital = Vitals(
                resident_id=resident.id,
                timestamp=measurement_date.replace(hour=8, minute=random.randint(0, 30)),
                blood_pressure_systolic=baseline_systolic + random.randint(-10, 15),
                blood_pressure_diastolic=baseline_diastolic + random.randint(-5, 10),
                heart_rate=baseline_heart_rate + random.randint(-10, 10),
                temperature=baseline_temp + random.uniform(-0.5, 0.5),
                spo2=baseline_oxygen + random.randint(-2, 2),
                respiratory_rate=random.randint(12, 20)
            )
            vitals_records.append(morning_vital)
            
            # Evening vitals for some residents (around 6 PM)
            if random.random() > 0.5:  # 50% chance of evening vitals
                evening_vital = Vitals(
                    resident_id=resident.id,
                    timestamp=measurement_date.replace(hour=18, minute=random.randint(0, 30)),
                    blood_pressure_systolic=baseline_systolic + random.randint(-10, 15),
                    blood_pressure_diastolic=baseline_diastolic + random.randint(-5, 10),
                    heart_rate=baseline_heart_rate + random.randint(-10, 10),
                    temperature=baseline_temp + random.uniform(-0.5, 0.5),
                    spo2=baseline_oxygen + random.randint(-2, 2),
                    respiratory_rate=random.randint(12, 20)
                )
                vitals_records.append(evening_vital)
    
    # Batch insert for better performance
    db.add_all(vitals_records)
    db.commit()
    print(f"✅ Created {len(vitals_records)} vital records")
    return vitals_records

def generate_alerts(residents):
    """Generate realistic alerts for residents"""
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
    
    # Generate alerts for last 30 days
    for resident in residents:
        # Number of alerts per resident (0-10)
        num_alerts = random.randint(0, 10)
        
        for _ in range(num_alerts):
            alert_type, priority, message_template = random.choice(alert_types)
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
                # Extract medication names from medical_history
                if "Medications:" in resident.medical_history:
                    meds_str = resident.medical_history.split("Medications:")[-1].strip()
                    meds = [m.strip() for m in meds_str.split(",") if m.strip()]
                    if meds:
                        message = f"Missed {random.choice(meds)} dose"
                    else:
                        continue
                else:
                    continue
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
            else:
                # For medication refill alerts
                if "Medications:" in resident.medical_history:
                    meds_str = resident.medical_history.split("Medications:")[-1].strip()
                    meds = [m.strip() for m in meds_str.split(",") if m.strip()]
                    if meds:
                        message = f"Medication {random.choice(meds)} needs refill"
                    else:
                        continue
                else:
                    continue
            
            alert = Alert(
                resident_id=resident.id,
                type=alert_type,
                severity=priority,
                message=message,
                timestamp=alert_date,
                resolved=random.choice([True, False]) if alert_date < datetime.utcnow() - timedelta(days=1) else False,
                resolved_at=alert_date + timedelta(hours=random.randint(1, 24)) if random.random() > 0.3 else None,
                resolved_by=None  # No user IDs to reference
            )
            alerts.append(alert)
    
    db.add_all(alerts)
    db.commit()
    print(f"✅ Created {len(alerts)} alerts")
    return alerts

def main():
    try:
        print("\n🏥 Creating Athulya Senior Care with synthetic data...\n")
        
        # Create facility
        facility = create_athulya_facility()
        
        # Generate residents
        residents = generate_residents(facility.id, count=80)
        
        # Generate vitals data (30-45 days)
        vitals = generate_vitals_data(residents, days=35)
        
        # Generate alerts
        alerts = generate_alerts(residents)
        
        print("\n✨ Successfully created Athulya Senior Care with:")
        print(f"   • 1 Facility")
        print(f"   • 80 Residents") 
        print(f"   • {len(vitals)} Vital records")
        print(f"   • {len(alerts)} Alerts")
        print("\n🎉 Data generation complete!")
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()