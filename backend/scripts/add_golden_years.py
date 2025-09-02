#!/usr/bin/env python3
"""
Add Golden Years Retirement facility with residents and data
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
import random
from app.models.models import Facility, Resident, User, Vitals, Alert
from app.models.database import Base

DATABASE_URL = "sqlite:///senior_care.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_golden_years():
    db = SessionLocal()
    
    try:
        # Check if Golden Years already exists
        existing = db.query(Facility).filter_by(name="Golden Years Retirement").first()
        if existing:
            print("Golden Years Retirement already exists!")
            return
        
        # Create Golden Years facility
        golden_years = Facility(
            name="Golden Years Retirement",
            address="789 Sunset Boulevard, Mumbai",
            contact_number="+91-22-2234-5678",
            capacity=150
        )
        db.add(golden_years)
        db.commit()
        
        print(f"✅ Created facility: Golden Years Retirement")
        
        # Create residents for Golden Years
        residents_data = [
            {"name": "Anjali Sharma", "age": 72, "room": "201", "medical": "Arthritis, Hypertension"},
            {"name": "Mohan Reddy", "age": 78, "room": "202", "medical": "Diabetes Type 2, Cardiac"},
            {"name": "Priya Nair", "age": 68, "room": "203", "medical": "Asthma, Anxiety"},
            {"name": "Rajesh Gupta", "age": 75, "room": "204", "medical": "Parkinson's, Depression"},
            {"name": "Geeta Patel", "age": 70, "room": "205", "medical": "Osteoporosis, Thyroid"},
            {"name": "Vikram Singh", "age": 82, "room": "206", "medical": "Alzheimer's, Hypertension"},
            {"name": "Sunita Rao", "age": 69, "room": "207", "medical": "Diabetes, Vision impairment"},
            {"name": "Ashok Kumar", "age": 77, "room": "208", "medical": "COPD, Heart disease"},
            {"name": "Meera Desai", "age": 71, "room": "209", "medical": "Arthritis, Insomnia"},
            {"name": "Sunil Joshi", "age": 74, "room": "210", "medical": "Kidney disease, Anemia"},
            {"name": "Kavita Menon", "age": 76, "room": "211", "medical": "Stroke recovery, Speech therapy"},
            {"name": "Prakash Iyer", "age": 79, "room": "212", "medical": "Dementia, Falls risk"},
            {"name": "Rekha Bhatt", "age": 67, "room": "213", "medical": "Cancer survivor, Fatigue"},
            {"name": "Dinesh Verma", "age": 73, "room": "214", "medical": "Hearing loss, Depression"},
            {"name": "Shanti Devi", "age": 85, "room": "215", "medical": "Frailty, Multiple medications"},
            {"name": "Arjun Malhotra", "age": 72, "room": "216", "medical": "Diabetes, Neuropathy"},
            {"name": "Lata Krishnan", "age": 70, "room": "217", "medical": "Hypertension, Obesity"},
            {"name": "Ravi Agarwal", "age": 76, "room": "218", "medical": "Cardiac arrhythmia, Anticoagulation"},
            {"name": "Pushpa Sinha", "age": 74, "room": "219", "medical": "Osteoarthritis, Chronic pain"},
            {"name": "Kiran Bose", "age": 69, "room": "220", "medical": "Anxiety disorder, Insomnia"},
            {"name": "Mahesh Pandey", "age": 81, "room": "221", "medical": "Parkinson's, Mobility issues"},
            {"name": "Sarla Banerjee", "age": 77, "room": "222", "medical": "Diabetes, Retinopathy"},
            {"name": "Anil Chopra", "age": 73, "room": "223", "medical": "COPD, Oxygen therapy"},
            {"name": "Usha Saxena", "age": 68, "room": "224", "medical": "Thyroid disorder, Weight management"},
            {"name": "Gopal Nath", "age": 80, "room": "225", "medical": "Mild cognitive impairment, Falls"},
            {"name": "Radha Pillai", "age": 71, "room": "226", "medical": "Rheumatoid arthritis, Immunosuppression"},
            {"name": "Sanjay Kaul", "age": 75, "room": "227", "medical": "Post-stroke, Physical therapy"},
            {"name": "Madhuri Das", "age": 72, "room": "228", "medical": "Depression, Social isolation"},
            {"name": "Ramesh Tiwari", "age": 78, "room": "229", "medical": "Prostate issues, UTI prone"},
            {"name": "Kamini Shah", "age": 70, "room": "230", "medical": "Osteoporosis, Fracture risk"},
            {"name": "Vinod Mehta", "age": 76, "room": "231", "medical": "Heart failure, Fluid restriction"},
            {"name": "Savita Kulkarni", "age": 73, "room": "232", "medical": "Diabetes, Wound care"},
            {"name": "Harish Bhatia", "age": 79, "room": "233", "medical": "Alzheimer's, Wandering risk"},
            {"name": "Nirmala Jain", "age": 67, "room": "234", "medical": "Chronic fatigue, Vitamin deficiency"},
            {"name": "Deepak Roy", "age": 74, "room": "235", "medical": "Glaucoma, Visual aids needed"},
            {"name": "Veena Ahuja", "age": 71, "room": "236", "medical": "Hypertension, Dietary restrictions"},
            {"name": "Satish Mishra", "age": 77, "room": "237", "medical": "Chronic kidney disease, Dialysis"},
            {"name": "Asha Kapoor", "age": 69, "room": "238", "medical": "Asthma, Allergies"},
            {"name": "Naresh Batra", "age": 75, "room": "239", "medical": "Cardiac pacemaker, Monitoring"},
            {"name": "Sudha Acharya", "age": 72, "room": "240", "medical": "Arthritis, Physical therapy"},
            {"name": "Prem Chand", "age": 80, "room": "241", "medical": "Dementia, Behavioral issues"},
            {"name": "Kamal Kaur", "age": 68, "room": "242", "medical": "Depression, Counseling"},
            {"name": "Jagdish Prasad", "age": 76, "room": "243", "medical": "COPD, Respiratory therapy"},
            {"name": "Rita Fernandes", "age": 73, "room": "244", "medical": "Diabetes, Foot care"},
            {"name": "Om Prakash", "age": 78, "room": "245", "medical": "Parkinson's, Medication management"}
        ]
        
        created_residents = []
        for r_data in residents_data:
            resident = Resident(
                facility_id=golden_years.id,
                name=r_data["name"],
                age=r_data["age"],
                room_number=r_data["room"],
                medical_history=r_data["medical"],
                emergency_contact=f"Family: +91-{random.randint(70000, 99999)}-{random.randint(10000, 99999)}",
                admission_date=datetime.utcnow() - timedelta(days=random.randint(30, 365))
            )
            db.add(resident)
            created_residents.append(resident)
        
        db.commit()
        print(f"✅ Created {len(created_residents)} residents")
        
        # Generate vitals for each resident
        vitals_count = 0
        for resident in created_residents:
            # Generate 30 days of vitals
            for day in range(30):
                for _ in range(random.randint(1, 3)):  # 1-3 readings per day
                    vital_time = datetime.utcnow() - timedelta(days=day, hours=random.randint(0, 23))
                    
                    vital = Vitals(
                        resident_id=resident.id,
                        blood_pressure_systolic=random.randint(110, 160),
                        blood_pressure_diastolic=random.randint(70, 100),
                        heart_rate=random.randint(60, 100),
                        temperature=round(random.uniform(97.0, 99.5), 1),
                        spo2=random.randint(92, 100),
                        respiratory_rate=random.randint(12, 20),
                        timestamp=vital_time
                    )
                    db.add(vital)
                    vitals_count += 1
        
        db.commit()
        print(f"✅ Created {vitals_count} vital records")
        
        # Generate alerts
        alert_types = ["HIGH_BLOOD_PRESSURE", "LOW_OXYGEN", "IRREGULAR_HEART_RATE", "HIGH_TEMPERATURE", "FALL_DETECTED", "MEDICATION_MISSED"]
        severities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
        
        alerts_count = 0
        for resident in created_residents:
            # Generate 5-15 alerts per resident over the past 30 days
            for _ in range(random.randint(5, 15)):
                alert = Alert(
                    resident_id=resident.id,
                    alert_type=random.choice(alert_types),
                    severity=random.choice(severities),
                    message=f"Alert for {resident.name} - Automated monitoring system",
                    resolved=random.choice([True, False]),
                    timestamp=datetime.utcnow() - timedelta(days=random.randint(0, 30), hours=random.randint(0, 23))
                )
                db.add(alert)
                alerts_count += 1
        
        db.commit()
        print(f"✅ Created {alerts_count} alerts")
        
        print(f"\n✨ Successfully created Golden Years Retirement with:")
        print(f"   • 1 Facility")
        print(f"   • {len(created_residents)} Residents")
        print(f"   • {vitals_count} Vital records")
        print(f"   • {alerts_count} Alerts")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🏥 Creating Golden Years Retirement with synthetic data...\n")
    create_golden_years()
    print("\n🎉 Data generation complete!")