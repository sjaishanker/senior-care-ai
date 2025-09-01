import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime, timedelta
import random
from app.models.database import SessionLocal
from app.models.models import Resident, Facility, Vitals

db = SessionLocal()

def generate_vitals_for_athulya():
    """Generate 30-45 days of vitals data for Athulya Senior Care residents"""
    
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
    print("🔄 Generating vitals data...")
    
    vitals_records = []
    
    for i, resident in enumerate(residents):
        # Randomize number of days between 30-45
        actual_days = random.randint(30, 45)
        
        # Set baseline vitals based on conditions in medical history
        has_hypertension = "Hypertension" in (resident.medical_history or "")
        has_diabetes = "Diabetes" in (resident.medical_history or "")
        
        # Baseline values
        baseline_systolic = 130 if has_hypertension else 120
        baseline_diastolic = 85 if has_hypertension else 80
        baseline_heart_rate = random.randint(65, 75)
        baseline_temp = 98.6
        baseline_oxygen = random.randint(95, 98)
        baseline_respiratory = random.randint(14, 18)
        
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
                respiratory_rate=baseline_respiratory + random.randint(-2, 3)
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
                    respiratory_rate=baseline_respiratory + random.randint(-2, 3)
                )
                vitals_records.append(evening_vital)
        
        # Progress indicator
        if (i + 1) % 10 == 0:
            print(f"   Processed {i + 1}/{len(residents)} residents...")
    
    # Batch insert for better performance
    print("💾 Saving to database...")
    db.add_all(vitals_records)
    db.commit()
    
    print(f"✅ Created {len(vitals_records)} vital records for Athulya Senior Care")
    
    # Show summary
    avg_records_per_resident = len(vitals_records) / len(residents)
    print(f"\n📊 Summary:")
    print(f"   Total residents: {len(residents)}")
    print(f"   Total vital records: {len(vitals_records)}")
    print(f"   Average records per resident: {avg_records_per_resident:.1f}")
    print(f"   Date range: {actual_days} days")

if __name__ == "__main__":
    try:
        generate_vitals_for_athulya()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()