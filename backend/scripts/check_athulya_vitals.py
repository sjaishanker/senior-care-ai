import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.database import SessionLocal
from app.models.models import Facility, Resident, Vitals
from sqlalchemy import func
from datetime import datetime, timedelta

db = SessionLocal()

def check_athulya_vitals():
    """Check vitals data for Athulya Senior Care residents"""
    
    # Find Athulya facility
    athulya = db.query(Facility).filter(
        Facility.name == "Athulya Senior Care"
    ).first()
    
    if not athulya:
        print("❌ Athulya Senior Care facility not found!")
        return
    
    print(f"✅ Found Athulya Senior Care (ID: {athulya.id})")
    
    # Get residents
    residents = db.query(Resident).filter(
        Resident.facility_id == athulya.id
    ).all()
    
    print(f"👥 Total residents: {len(residents)}")
    
    # Check vitals for these residents
    resident_ids = [r.id for r in residents]
    
    # Get all vitals
    all_vitals = db.query(Vitals).filter(
        Vitals.resident_id.in_(resident_ids)
    ).all()
    
    print(f"\n📊 Vitals Statistics:")
    print(f"   Total vital records: {len(all_vitals)}")
    
    if len(all_vitals) == 0:
        print("\n⚠️  NO VITALS FOUND for Athulya Senior Care residents!")
        return
    
    # Get date range of vitals
    oldest_vital = db.query(func.min(Vitals.timestamp)).filter(
        Vitals.resident_id.in_(resident_ids)
    ).scalar()
    
    newest_vital = db.query(func.max(Vitals.timestamp)).filter(
        Vitals.resident_id.in_(resident_ids)
    ).scalar()
    
    if oldest_vital and newest_vital:
        days_span = (newest_vital - oldest_vital).days + 1
        print(f"\n📅 Date Range:")
        print(f"   Oldest record: {oldest_vital.strftime('%Y-%m-%d %H:%M')}")
        print(f"   Newest record: {newest_vital.strftime('%Y-%m-%d %H:%M')}")
        print(f"   Total days span: {days_span} days")
    
    # Count vitals per resident
    print(f"\n👤 Per Resident Statistics:")
    residents_with_vitals = 0
    total_days_covered = []
    
    for resident in residents[:10]:  # Sample first 10 residents
        vitals_count = db.query(func.count(Vitals.id)).filter(
            Vitals.resident_id == resident.id
        ).scalar()
        
        if vitals_count > 0:
            residents_with_vitals += 1
            
            # Get date range for this resident
            oldest = db.query(func.min(Vitals.timestamp)).filter(
                Vitals.resident_id == resident.id
            ).scalar()
            
            newest = db.query(func.max(Vitals.timestamp)).filter(
                Vitals.resident_id == resident.id
            ).scalar()
            
            if oldest and newest:
                days = (newest - oldest).days + 1
                total_days_covered.append(days)
                print(f"   {resident.name}: {vitals_count} records over {days} days")
    
    # Summary
    print(f"\n📈 Summary:")
    print(f"   Residents with vitals: {residents_with_vitals}/{len(residents)}")
    if total_days_covered:
        avg_days = sum(total_days_covered) / len(total_days_covered)
        print(f"   Average days of data per resident: {avg_days:.1f} days")
    
    # Check recent vitals (last 24 hours)
    recent_cutoff = datetime.utcnow() - timedelta(hours=24)
    recent_vitals = db.query(func.count(Vitals.id)).filter(
        Vitals.resident_id.in_(resident_ids),
        Vitals.timestamp >= recent_cutoff
    ).scalar()
    
    print(f"\n⏱️  Recent Activity:")
    print(f"   Vitals in last 24 hours: {recent_vitals}")
    
    # Sample some vitals
    print("\n📋 Sample vitals (first 5):")
    sample_vitals = all_vitals[:5] if all_vitals else []
    for vital in sample_vitals:
        resident = next((r for r in residents if r.id == vital.resident_id), None)
        resident_name = resident.name if resident else "Unknown"
        print(f"   - {resident_name} at {vital.timestamp.strftime('%Y-%m-%d %H:%M')}")
        print(f"     BP: {vital.blood_pressure_systolic:.0f}/{vital.blood_pressure_diastolic:.0f}")
        print(f"     HR: {vital.heart_rate:.0f} bpm, Temp: {vital.temperature:.1f}°F")
        print(f"     SpO2: {vital.spo2:.0f}%, RR: {vital.respiratory_rate:.0f}")
        print()

if __name__ == "__main__":
    try:
        check_athulya_vitals()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()