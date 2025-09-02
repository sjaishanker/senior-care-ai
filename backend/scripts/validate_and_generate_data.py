#!/usr/bin/env python3
"""
Phase 1 Data Validation and Generation Script
Validates that all residents have proper data and generates missing data automatically
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
import random
import requests
from typing import Dict, List, Tuple
from app.models.models import Facility, Resident, Vitals, Alert, AlertSeverity
from app.models.database import Base

DATABASE_URL = "sqlite:///senior_care.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Configuration
MIN_RESIDENTS_PER_FACILITY = 40
MIN_VITALS_PER_RESIDENT_PER_DAY = 2
MIN_ALERTS_PER_RESIDENT = 3
DAYS_OF_DATA = 30
API_BASE_URL = "http://localhost:8000"

# Indian names for data generation
FIRST_NAMES = [
    "Arjun", "Priya", "Ravi", "Anita", "Suresh", "Kavita", "Vijay", "Meera",
    "Rajesh", "Sunita", "Ashok", "Geeta", "Anil", "Radha", "Prakash", "Usha",
    "Mahesh", "Savita", "Dinesh", "Rekha", "Satish", "Nirmala", "Vinod", "Kamini"
]

LAST_NAMES = [
    "Sharma", "Gupta", "Patel", "Singh", "Kumar", "Reddy", "Rao", "Nair",
    "Menon", "Iyer", "Desai", "Joshi", "Verma", "Bhatt", "Malhotra", "Krishnan"
]

MEDICAL_CONDITIONS = [
    "Diabetes Type 2, Hypertension",
    "Arthritis, Osteoporosis",
    "Cardiac arrhythmia, Anticoagulation therapy",
    "Alzheimer's disease, Behavioral management",
    "Parkinson's disease, Fall risk",
    "COPD, Oxygen therapy",
    "Chronic kidney disease, Dialysis"
]

class DataValidator:
    def __init__(self):
        self.db = SessionLocal()
        self.validation_results = {
            "facilities": {},
            "issues": [],
            "actions_taken": []
        }
    
    def validate_all(self) -> Dict:
        """Run complete validation on all facilities and residents"""
        print("\n" + "="*60)
        print("🔍 PHASE 1 DATA VALIDATION STARTING...")
        print("="*60)
        
        facilities = self.db.query(Facility).all()
        
        if not facilities:
            self.validation_results["issues"].append("❌ No facilities found in database")
            self._create_default_facilities()
            facilities = self.db.query(Facility).all()
        
        for facility in facilities:
            self._validate_facility(facility)
        
        self._print_validation_summary()
        return self.validation_results
    
    def _validate_facility(self, facility: Facility):
        """Validate a single facility and its residents"""
        print(f"\n📍 Validating {facility.name} (ID: {facility.id})")
        
        facility_issues = []
        facility_stats = {
            "id": facility.id,
            "name": facility.name,
            "residents": 0,
            "vitals": 0,
            "alerts": 0,
            "issues": []
        }
        
        # Check resident count
        residents = self.db.query(Resident).filter_by(facility_id=facility.id).all()
        facility_stats["residents"] = len(residents)
        
        if len(residents) < MIN_RESIDENTS_PER_FACILITY:
            issue = f"Has only {len(residents)} residents (minimum: {MIN_RESIDENTS_PER_FACILITY})"
            facility_issues.append(issue)
            print(f"   ⚠️  {issue}")
            self._add_residents_to_facility(facility, MIN_RESIDENTS_PER_FACILITY - len(residents))
            residents = self.db.query(Resident).filter_by(facility_id=facility.id).all()
        else:
            print(f"   ✅ Residents: {len(residents)}")
        
        # Validate each resident
        for resident in residents:
            self._validate_resident(resident, facility_stats, facility_issues)
        
        facility_stats["issues"] = facility_issues
        self.validation_results["facilities"][facility.name] = facility_stats
    
    def _validate_resident(self, resident: Resident, facility_stats: Dict, facility_issues: List):
        """Validate a single resident's data"""
        resident_issues = []
        
        # Check emergency contact info
        if not resident.emergency_contact_name or resident.emergency_contact_name == "":
            self.db.query(Resident).filter_by(id=resident.id).update({
                "emergency_contact_name": f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"
            })
            self.db.commit()
            resident_issues.append(f"Fixed missing emergency contact name for {resident.name}")
        
        # Check vitals
        vitals_count = self.db.query(Vitals).filter_by(resident_id=resident.id).count()
        expected_vitals = DAYS_OF_DATA * MIN_VITALS_PER_RESIDENT_PER_DAY
        
        if vitals_count < expected_vitals:
            missing_vitals = expected_vitals - vitals_count
            resident_issues.append(f"{resident.name}: Missing {missing_vitals} vital records")
            self._generate_vitals_for_resident(resident, missing_vitals)
        
        facility_stats["vitals"] += vitals_count
        
        # Check alerts
        alerts_count = self.db.query(Alert).filter_by(resident_id=resident.id).count()
        
        if alerts_count < MIN_ALERTS_PER_RESIDENT:
            missing_alerts = MIN_ALERTS_PER_RESIDENT - alerts_count
            resident_issues.append(f"{resident.name}: Missing {missing_alerts} alerts")
            self._generate_alerts_for_resident(resident, missing_alerts)
        
        facility_stats["alerts"] += alerts_count
        
        if resident_issues:
            facility_issues.extend(resident_issues)
    
    def _add_residents_to_facility(self, facility: Facility, count: int):
        """Add missing residents to a facility"""
        print(f"   🔧 Adding {count} residents to {facility.name}...")
        
        # Get existing room numbers
        existing_rooms = self.db.query(Resident.room_number).filter_by(facility_id=facility.id).all()
        existing_rooms = [r[0] for r in existing_rooms]
        
        room_base = 100 * (facility.id % 10) if facility.id < 10 else 100
        current_count = len(existing_rooms)
        
        for i in range(count):
            room_num = room_base + current_count + i + 1
            while str(room_num) in existing_rooms:
                room_num += 1
            
            resident = Resident(
                facility_id=facility.id,
                name=f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}",
                age=random.randint(65, 92),
                room_number=str(room_num),
                medical_history=random.choice(MEDICAL_CONDITIONS),
                emergency_contact=f"+91-{random.randint(70000, 99999)}-{random.randint(10000, 99999)}",
                emergency_contact_name=f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}",
                admission_date=datetime.utcnow() - timedelta(days=random.randint(30, 365))
            )
            self.db.add(resident)
        
        self.db.commit()
        self.validation_results["actions_taken"].append(f"Added {count} residents to {facility.name}")
        print(f"   ✅ Added {count} residents")
    
    def _generate_vitals_for_resident(self, resident: Resident, count: int):
        """Generate missing vitals for a resident"""
        days_to_generate = min(count // MIN_VITALS_PER_RESIDENT_PER_DAY, DAYS_OF_DATA)
        
        for day in range(days_to_generate):
            for _ in range(MIN_VITALS_PER_RESIDENT_PER_DAY):
                vital_time = datetime.utcnow() - timedelta(days=day, hours=random.randint(6, 20))
                
                is_diabetic = "Diabetes" in resident.medical_history
                has_hypertension = "Hypertension" in resident.medical_history
                
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
                self.db.add(vital)
        
        self.db.commit()
        self.validation_results["actions_taken"].append(f"Generated {count} vitals for {resident.name}")
    
    def _generate_alerts_for_resident(self, resident: Resident, count: int):
        """Generate missing alerts for a resident"""
        alert_types = ["HIGH_BLOOD_PRESSURE", "LOW_OXYGEN", "IRREGULAR_HEART_RATE", 
                      "HIGH_TEMPERATURE", "FALL_DETECTED", "MEDICATION_MISSED"]
        
        for _ in range(count):
            days_ago = random.randint(0, DAYS_OF_DATA)
            
            # Severity based on medical history
            if "Alzheimer" in resident.medical_history or "Dementia" in resident.medical_history:
                severity = random.choice([AlertSeverity.MEDIUM, AlertSeverity.HIGH, AlertSeverity.CRITICAL])
            else:
                severity = random.choice([AlertSeverity.LOW, AlertSeverity.MEDIUM, AlertSeverity.HIGH])
            
            alert_type = random.choice(alert_types)
            
            alert = Alert(
                resident_id=resident.id,
                type=alert_type,
                severity=severity,
                message=f"{alert_type.replace('_', ' ').title()} detected for {resident.name}",
                resolved=random.choice([True, False]) if days_ago > 2 else False,
                timestamp=datetime.utcnow() - timedelta(days=days_ago, hours=random.randint(0, 23))
            )
            
            if alert.resolved:
                alert.resolved_at = alert.timestamp + timedelta(hours=random.randint(1, 24))
            
            self.db.add(alert)
        
        self.db.commit()
        self.validation_results["actions_taken"].append(f"Generated {count} alerts for {resident.name}")
    
    def _create_default_facilities(self):
        """Create default facilities if none exist"""
        print("\n🏥 Creating default facilities...")
        
        default_facilities = [
            {"name": "Sunshine Senior Living", "address": "123 Main St, Mumbai", "capacity": 50},
            {"name": "Harmony Eldercare", "address": "456 Park Ave, Delhi", "capacity": 60},
            {"name": "Golden Years Retirement", "address": "789 Sunset Blvd, Bangalore", "capacity": 45},
            {"name": "Athulya Senior Care", "address": "321 Beach Rd, Chennai", "capacity": 100}
        ]
        
        for f_data in default_facilities:
            facility = Facility(
                name=f_data["name"],
                address=f_data["address"],
                capacity=f_data["capacity"],
                contact_number=f"+91-{random.randint(70000, 99999)}-{random.randint(10000, 99999)}"
            )
            self.db.add(facility)
        
        self.db.commit()
        self.validation_results["actions_taken"].append("Created 4 default facilities")
        print("✅ Created 4 default facilities")
    
    def _print_validation_summary(self):
        """Print validation summary"""
        print("\n" + "="*60)
        print("📊 VALIDATION SUMMARY")
        print("="*60)
        
        # Facility summaries
        for facility_name, stats in self.validation_results["facilities"].items():
            print(f"\n📍 {facility_name}:")
            print(f"   • Residents: {stats['residents']}")
            print(f"   • Vitals: {stats['vitals']}")
            print(f"   • Alerts: {stats['alerts']}")
            
            if stats['issues']:
                print(f"   • Issues Fixed: {len(stats['issues'])}")
        
        # Total statistics
        total_residents = sum(f['residents'] for f in self.validation_results['facilities'].values())
        total_vitals = sum(f['vitals'] for f in self.validation_results['facilities'].values())
        total_alerts = sum(f['alerts'] for f in self.validation_results['facilities'].values())
        
        print("\n" + "-"*60)
        print("📈 TOTAL DATABASE STATISTICS:")
        print(f"   • Facilities: {len(self.validation_results['facilities'])}")
        print(f"   • Residents: {total_residents}")
        print(f"   • Vitals: {total_vitals}")
        print(f"   • Alerts: {total_alerts}")
        
        # Actions taken
        if self.validation_results["actions_taken"]:
            print("\n" + "-"*60)
            print("🔧 ACTIONS TAKEN:")
            for action in self.validation_results["actions_taken"][:10]:  # Show first 10
                print(f"   • {action}")
            
            if len(self.validation_results["actions_taken"]) > 10:
                print(f"   ... and {len(self.validation_results['actions_taken']) - 10} more actions")
        
        print("\n" + "="*60)
        print("✅ PHASE 1 DATA VALIDATION COMPLETE!")
        print("="*60)
    
    def close(self):
        """Close database connection"""
        self.db.close()

def test_api_connectivity():
    """Test if API is running and accessible"""
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ API is running and accessible")
            return True
    except:
        print("⚠️  API is not accessible. Make sure the backend is running on port 8000")
        return False

def main():
    print("\n🚀 PHASE 1 DATA VALIDATION AND GENERATION SCRIPT")
    print("This script validates and ensures all residents have proper data")
    
    # Test API connectivity
    if not test_api_connectivity():
        print("\n❌ Please start the backend server first:")
        print("   cd backend && source venv/bin/activate && uvicorn app.main:app --reload")
        return
    
    # Run validation
    validator = DataValidator()
    
    try:
        results = validator.validate_all()
        
        # Final check
        if not results["issues"] and not results["actions_taken"]:
            print("\n🎉 All data validation checks passed! No issues found.")
        else:
            print(f"\n✨ Fixed {len(results['actions_taken'])} issues automatically!")
        
    except Exception as e:
        print(f"\n❌ Error during validation: {e}")
        import traceback
        traceback.print_exc()
    finally:
        validator.close()

if __name__ == "__main__":
    main()