import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.database import SessionLocal
from app.models.models import Facility, Resident, Alert
from sqlalchemy import func
from datetime import datetime, timedelta

db = SessionLocal()

def check_athulya_alerts():
    """Check alerts for Athulya Senior Care"""
    
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
    
    # Check alerts for these residents
    resident_ids = [r.id for r in residents]
    
    # Get all alerts
    all_alerts = db.query(Alert).filter(
        Alert.resident_id.in_(resident_ids)
    ).all()
    
    print(f"\n📊 Alert Statistics:")
    print(f"   Total alerts: {len(all_alerts)}")
    
    # Count by severity
    severity_counts = db.query(
        Alert.severity,
        func.count(Alert.id)
    ).filter(
        Alert.resident_id.in_(resident_ids)
    ).group_by(Alert.severity).all()
    
    print("\n   By Severity:")
    for severity, count in severity_counts:
        print(f"   - {severity}: {count}")
    
    # Recent alerts (last 24 hours)
    recent_cutoff = datetime.utcnow() - timedelta(hours=24)
    recent_alerts = db.query(Alert).filter(
        Alert.resident_id.in_(resident_ids),
        Alert.timestamp >= recent_cutoff
    ).all()
    
    print(f"\n   Recent alerts (last 24h): {len(recent_alerts)}")
    
    # Unresolved alerts
    unresolved = db.query(Alert).filter(
        Alert.resident_id.in_(resident_ids),
        Alert.resolved == False
    ).all()
    
    print(f"   Unresolved alerts: {len(unresolved)}")
    
    # Sample some alerts
    print("\n📋 Sample alerts (first 5):")
    sample_alerts = all_alerts[:5] if all_alerts else []
    for alert in sample_alerts:
        resident = next((r for r in residents if r.id == alert.resident_id), None)
        resident_name = resident.name if resident else "Unknown"
        print(f"   - {alert.type} ({alert.severity}) for {resident_name}")
        print(f"     Message: {alert.message}")
        print(f"     Time: {alert.timestamp}")
        print(f"     Resolved: {alert.resolved}")
        print()
    
    # Check if there are NO alerts
    if len(all_alerts) == 0:
        print("\n⚠️  NO ALERTS FOUND for Athulya Senior Care residents!")
        print("This might indicate the alerts were not created properly.")

if __name__ == "__main__":
    try:
        check_athulya_alerts()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()