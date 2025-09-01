import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.database import SessionLocal
from app.models.models import Facility, Resident, Vitals, Alert
from sqlalchemy import func

db = SessionLocal()

def check_and_remove_duplicates():
    """Check for duplicate Athulya Senior Care facilities and keep only one"""
    
    # Find all Athulya facilities
    athulya_facilities = db.query(Facility).filter(
        Facility.name == "Athulya Senior Care"
    ).all()
    
    print(f"\n📊 Found {len(athulya_facilities)} Athulya Senior Care facilities")
    
    if len(athulya_facilities) <= 1:
        print("✅ No duplicates found!")
        return
    
    # Sort by ID to keep the first one (or by created_at if available)
    athulya_facilities.sort(key=lambda x: x.id)
    
    # Keep the first one
    facility_to_keep = athulya_facilities[0]
    facilities_to_remove = athulya_facilities[1:]
    
    print(f"\n🔍 Keeping facility ID: {facility_to_keep.id}")
    print(f"❌ Removing {len(facilities_to_remove)} duplicate facilities")
    
    # For each duplicate facility
    for facility in facilities_to_remove:
        # Count related data
        resident_count = db.query(func.count(Resident.id)).filter(
            Resident.facility_id == facility.id
        ).scalar()
        
        print(f"\n  Removing facility ID {facility.id} with {resident_count} residents")
        
        # Get all residents to delete their vitals and alerts
        residents = db.query(Resident).filter(
            Resident.facility_id == facility.id
        ).all()
        
        for resident in residents:
            # Delete vitals
            vitals_count = db.query(Vitals).filter(
                Vitals.resident_id == resident.id
            ).delete()
            
            # Delete alerts
            alerts_count = db.query(Alert).filter(
                Alert.resident_id == resident.id
            ).delete()
        
        # Delete residents
        db.query(Resident).filter(
            Resident.facility_id == facility.id
        ).delete()
        
        # Delete facility
        db.delete(facility)
    
    # Commit all changes
    db.commit()
    print("\n✨ Successfully removed duplicate facilities!")
    
    # Show final count
    final_count = db.query(func.count(Facility.id)).filter(
        Facility.name == "Athulya Senior Care"
    ).scalar()
    print(f"📊 Final count of Athulya Senior Care facilities: {final_count}")
    
    # Show all facilities
    print("\n📋 All facilities in database:")
    all_facilities = db.query(Facility).all()
    for facility in all_facilities:
        resident_count = db.query(func.count(Resident.id)).filter(
            Resident.facility_id == facility.id
        ).scalar()
        print(f"  - {facility.name} (ID: {facility.id}, Residents: {resident_count})")

if __name__ == "__main__":
    try:
        check_and_remove_duplicates()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        db.rollback()
    finally:
        db.close()