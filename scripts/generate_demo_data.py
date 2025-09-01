import sys
import os
backend_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'backend')
sys.path.insert(0, backend_path)

from app.models.database import SessionLocal, engine
from app.models.models import Base, Facility, Resident, Vitals, Alert, User, AlertSeverity, UserRole
from app.api.auth import get_password_hash
from datetime import datetime, timedelta
import random
import json

Base.metadata.create_all(bind=engine)

def generate_alert_for_resident(resident, vitals, day):
    """Generate specific alerts based on resident profile and day"""
    alert_patterns = [
        ("heart_rate", AlertSeverity.HIGH, f"Heart rate elevated: {vitals.heart_rate} bpm for {resident.name}"),
        ("blood_pressure", AlertSeverity.MEDIUM, f"Blood pressure spike: {vitals.blood_pressure_systolic}/{vitals.blood_pressure_diastolic} for {resident.name}"),
        ("temperature", AlertSeverity.HIGH, f"Fever detected: {vitals.temperature}°C for {resident.name}"),
        ("fall_risk", AlertSeverity.MEDIUM, f"Fall risk assessment elevated for {resident.name} - increased movement instability"),
        ("medication", AlertSeverity.LOW, f"Medication reminder: {resident.name} missed evening medication"),
        ("spo2", AlertSeverity.HIGH, f"Oxygen saturation low: {vitals.spo2}% for {resident.name}"),
    ]
    
    # Select alert based on medical history and day pattern
    if "Diabetes" in resident.medical_history and day % 7 == 0:
        return ("blood_pressure", AlertSeverity.MEDIUM, f"BP monitoring required for diabetic patient {resident.name}: {vitals.blood_pressure_systolic}/{vitals.blood_pressure_diastolic}")
    elif "Heart Disease" in resident.medical_history and day % 14 == 0:
        return ("heart_rate", AlertSeverity.HIGH, f"Cardiac monitoring alert for {resident.name}: HR {vitals.heart_rate} bpm")
    elif day % 21 == 0:
        return ("fall_risk", AlertSeverity.MEDIUM, f"Weekly fall risk assessment for {resident.name} - review mobility aids")
    else:
        return random.choice(alert_patterns)

def generate_random_alert(resident, vitals):
    """Generate random alerts for variety"""
    random_alerts = [
        ("sleep_pattern", AlertSeverity.LOW, f"Sleep pattern irregularity detected for {resident.name}"),
        ("activity", AlertSeverity.LOW, f"Low activity levels noted for {resident.name} today"),
        ("hydration", AlertSeverity.MEDIUM, f"Hydration reminder for {resident.name}"),
        ("social", AlertSeverity.LOW, f"Social engagement recommended for {resident.name}"),
        ("appointment", AlertSeverity.LOW, f"Upcoming medical appointment reminder for {resident.name}"),
        ("medication", AlertSeverity.MEDIUM, f"Medication adherence alert for {resident.name}"),
        ("bathroom", AlertSeverity.HIGH, f"Extended bathroom visit detected for {resident.name}"),
        ("wandering", AlertSeverity.HIGH, f"Unusual movement pattern detected for {resident.name}"),
        ("emergency_button", AlertSeverity.CRITICAL, f"Emergency button pressed by {resident.name}"),
        ("fall_detected", AlertSeverity.CRITICAL, f"Potential fall detected for {resident.name}"),
        ("missed_meal", AlertSeverity.MEDIUM, f"Missed meal notification for {resident.name}"),
        ("visitor_request", AlertSeverity.LOW, f"Visitor access request for {resident.name}"),
        ("therapy_session", AlertSeverity.LOW, f"Physical therapy session scheduled for {resident.name}"),
        ("mood_alert", AlertSeverity.MEDIUM, f"Mood pattern change detected for {resident.name}"),
        ("room_sensor", AlertSeverity.HIGH, f"Room sensor anomaly detected for {resident.name}"),
    ]
    
    return random.choice(random_alerts)

def generate_demo_data():
    db = SessionLocal()
    
    # Clear existing data
    db.query(Alert).delete()
    db.query(Vitals).delete()
    db.query(Resident).delete()
    db.query(User).delete()
    db.query(Facility).delete()
    db.commit()
    
    # Create multiple facilities (famous senior living in Bangalore)
    facilities_data = [
        {
            "name": "Covai Care Senior Living",  # Well-known premium facility
            "address": "Whitefield, Bangalore",
            "capacity": 50,
            "contact_number": "+91 9876543210"
        },
        {
            "name": "Ashiana Senior Living", 
            "address": "Electronic City, Bangalore", 
            "capacity": 40,
            "contact_number": "+91 9876543220"
        },
        {
            "name": "Prapthi Senior Care",
            "address": "Koramangala, Bangalore",
            "capacity": 30, 
            "contact_number": "+91 9876543230"
        }
    ]
    
    facilities = []
    for facility_data in facilities_data:
        facility = Facility(**facility_data)
        db.add(facility)
        facilities.append(facility)
    
    db.commit()
    
    # Create users for each facility
    for i, facility in enumerate(facilities):
        admin_user = User(
            email=f"admin{i+1}@seniorcare.com",
            name=f"Admin User {i+1}",
            hashed_password=get_password_hash("admin123"),
            role=UserRole.ADMIN,
            facility_id=facility.id
        )
        db.add(admin_user)
        
        family_user = User(
            email=f"family{i+1}@example.com", 
            name=f"Family Member {i+1}",
            hashed_password=get_password_hash("family123"),
            role=UserRole.FAMILY,
            facility_id=facility.id
        )
        db.add(family_user)
    
    # Also create a global admin
    global_admin = User(
        email="admin@seniorcare.com",
        name="Global Admin",
        hashed_password=get_password_hash("admin123"),
        role=UserRole.ADMIN,
        facility_id=facilities[0].id  # Default to first facility
    )
    db.add(global_admin)
    
    db.commit()
    
    indian_names = [
        ("Kamala Devi", 78, "101", "+91 9876543211", "Raj Sharma"),
        ("Suresh Kumar", 82, "102", "+91 9876543212", "Priya Kumar"),
        ("Lakshmi Amma", 75, "103", "+91 9876543213", "Arun Nair"),
        ("Ravi Shankar", 79, "104", "+91 9876543214", "Meera Shankar"),
        ("Padma Reddy", 81, "105", "+91 9876543215", "Krishna Reddy"),
        ("Mohan Das", 77, "106", "+91 9876543216", "Gita Das"),
        ("Sarla Gupta", 83, "107", "+91 9876543217", "Amit Gupta"),
        ("Venkatesh Iyer", 76, "108", "+91 9876543218", "Sita Iyer"),
        ("Radha Krishnan", 80, "109", "+91 9876543219", "Gopal Krishnan"),
        ("Abdul Rahman", 78, "110", "+91 9876543220", "Fatima Rahman"),
        ("Mary Thomas", 79, "201", "+91 9876543221", "John Thomas"),
        ("Gurpreet Singh", 81, "202", "+91 9876543222", "Harpreet Kaur"),
        ("Anjali Patel", 77, "203", "+91 9876543223", "Vijay Patel"),
        ("Ramesh Joshi", 82, "204", "+91 9876543224", "Sunita Joshi"),
        ("Shanta Bai", 84, "205", "+91 9876543225", "Prakash Rao"),
        ("Govind Prasad", 76, "206", "+91 9876543226", "Kavita Prasad"),
        ("Fatima Begum", 78, "207", "+91 9876543227", "Ahmed Ali"),
        ("Joseph Peter", 80, "208", "+91 9876543228", "Susan Peter"),
        ("Indira Nair", 79, "209", "+91 9876543229", "Rajan Nair"),
        ("Bala Subramanian", 77, "210", "+91 9876543230", "Kamala Subramanian"),
        ("Sushila Devi", 75, "211", "+91 9876543231", "Ramesh Gupta"),
        ("Narayan Murthy", 83, "212", "+91 9876543232", "Sudha Murthy"),
        ("Pushpa Rani", 79, "213", "+91 9876543233", "Vikram Singh"),
        ("Jagdish Prasad", 81, "214", "+91 9876543234", "Meena Prasad"),
        ("Saraswati Kumari", 76, "215", "+91 9876543235", "Ashok Kumar"),
        ("Harish Chandra", 80, "216", "+91 9876543236", "Kamala Chandra"),
        ("Rukmini Bai", 78, "217", "+91 9876543237", "Suresh Rao"),
        ("Gopal Krishna", 82, "218", "+91 9876543238", "Radha Krishna"),
        ("Shanti Devi", 77, "219", "+91 9876543239", "Mohan Lal"),
        ("Ramakant Sharma", 85, "220", "+91 9876543240", "Sita Sharma"),
        ("Vasanti Patil", 74, "301", "+91 9876543241", "Anil Patil"),
        ("Chandrakant Joshi", 79, "302", "+91 9876543242", "Usha Joshi"),
        ("Lila Devi", 81, "303", "+91 9876543243", "Rajesh Kumar"),
        ("Mahesh Babu", 76, "304", "+91 9876543244", "Lakshmi Babu"),
        ("Sumitra Amma", 83, "305", "+91 9876543245", "Ravi Menon"),
        ("Narasimha Rao", 80, "306", "+91 9876543246", "Kamala Rao"),
        ("Kiran Bala", 78, "307", "+91 9876543247", "Sunil Bala"),
        ("Dinesh Chand", 82, "308", "+91 9876543248", "Geeta Chand"),
        ("Parvati Devi", 75, "309", "+91 9876543249", "Om Prakash"),
        ("Subhash Reddy", 79, "310", "+91 9876543250", "Anita Reddy"),
        ("Kamal Kishore", 81, "311", "+91 9876543251", "Sunita Kishore"),
        ("Rekha Sharma", 77, "312", "+91 9876543252", "Vinod Sharma"),
        ("Brijesh Kumar", 84, "313", "+91 9876543253", "Manju Kumar"),
        ("Sulochana Devi", 76, "314", "+91 9876543254", "Satish Gupta"),
        ("Raman Lal", 78, "315", "+91 9876543255", "Kiran Lal"),
        ("Ganga Devi", 80, "316", "+91 9876543256", "Hari Shankar"),
        ("Pratap Singh", 82, "317", "+91 9876543257", "Kamla Singh"),
        ("Uma Devi", 75, "318", "+91 9876543258", "Rajeev Kumar"),
        ("Balram Yadav", 79, "319", "+91 9876543259", "Sushma Yadav"),
        ("Durga Prasad", 83, "320", "+91 9876543260", "Maya Prasad")
    ]
    
    residents = []
    residents_per_facility = [30, 15, 5]  # Different sizes for different facilities
    current_count = 0
    
    for idx, (name, age, room, contact, contact_name) in enumerate(indian_names):
        # Determine which facility this resident belongs to
        facility_index = 0
        for i, count in enumerate(residents_per_facility):
            if idx < sum(residents_per_facility[:i+1]):
                facility_index = i
                break
        
        medical_conditions = random.choice([
            "Diabetes Type 2, Hypertension",
            "Arthritis, Mild Dementia", 
            "Heart Disease, Diabetes",
            "Hypertension",
            "Diabetes, Arthritis"
        ])
        
        resident = Resident(
            name=name,
            age=age,
            room_number=room,
            medical_history=medical_conditions,
            emergency_contact=contact,
            emergency_contact_name=contact_name,
            facility_id=facilities[facility_index].id
        )
        db.add(resident)
        residents.append(resident)
    
    db.commit()
    
    now = datetime.utcnow()
    
    # Generate vitals for each resident for 30 days (every 4 hours = 6 times per day)
    for resident_idx, resident in enumerate(residents):
        # Each resident has different baseline vitals based on their medical history
        if "Diabetes" in resident.medical_history:
            base_hr = random.randint(75, 90)
            base_bp_sys = random.randint(130, 145)
        elif "Heart Disease" in resident.medical_history:
            base_hr = random.randint(65, 80)
            base_bp_sys = random.randint(120, 140)
        else:
            base_hr = random.randint(65, 85)
            base_bp_sys = random.randint(110, 130)
        
        base_bp_dia = random.randint(70, 85)
        base_temp = random.uniform(36.2, 37.2)
        base_spo2 = random.randint(95, 99)
        base_rr = random.randint(14, 18)
        
        # Generate alerts for specific days (weekly pattern)
        alert_days = [7, 14, 21, 28]  # Weekly alerts
        
        for day in range(30):  # 30 days of data
            for reading in range(6):  # 6 readings per day (every 4 hours)
                hours_ago = (29 - day) * 24 + (5 - reading) * 4
                timestamp = now - timedelta(hours=hours_ago)
                
                # Add some daily variation
                daily_variation = random.uniform(0.9, 1.1)
                
                # Add time-of-day effects
                hour = timestamp.hour
                if hour < 6:  # Early morning - lower values
                    time_factor = 0.95
                elif hour < 12:  # Morning - normal
                    time_factor = 1.0
                elif hour < 18:  # Afternoon - slightly higher
                    time_factor = 1.05
                else:  # Evening - moderate
                    time_factor = 1.0
                
                vitals = Vitals(
                    resident_id=resident.id,
                    timestamp=timestamp,
                    heart_rate=round(base_hr * daily_variation * time_factor + random.randint(-5, 5)),
                    blood_pressure_systolic=round(base_bp_sys * daily_variation * time_factor + random.randint(-10, 10)),
                    blood_pressure_diastolic=round(base_bp_dia * daily_variation + random.randint(-5, 5)),
                    temperature=round(base_temp + random.uniform(-0.4, 0.4), 1),
                    spo2=min(100, round(base_spo2 * time_factor + random.randint(-3, 2))),
                    respiratory_rate=round(base_rr * time_factor + random.randint(-2, 2))
                )
                db.add(vitals)
                
                # Generate systematic alerts based on patterns
                if day in alert_days and reading == 2:  # Midday alerts on specific days
                    alert_type, severity, message = generate_alert_for_resident(resident, vitals, day)
                    if alert_type:
                        alert = Alert(
                            resident_id=resident.id,
                            type=alert_type,
                            severity=severity,
                            message=message,
                            timestamp=timestamp
                        )
                        db.add(alert)
                
                # Generate vitals-based alerts when thresholds are crossed
                if vitals.heart_rate > 100 or vitals.heart_rate < 60:
                    severity = AlertSeverity.CRITICAL if vitals.heart_rate > 120 or vitals.heart_rate < 50 else AlertSeverity.HIGH
                    alert = Alert(
                        resident_id=resident.id,
                        type="heart_rate",
                        severity=severity,
                        message=f"Heart rate anomaly: {vitals.heart_rate} bpm for {resident.name}",
                        timestamp=timestamp
                    )
                    db.add(alert)
                
                if vitals.blood_pressure_systolic > 140 or vitals.blood_pressure_systolic < 90:
                    severity = AlertSeverity.CRITICAL if vitals.blood_pressure_systolic > 180 or vitals.blood_pressure_systolic < 80 else AlertSeverity.HIGH
                    alert = Alert(
                        resident_id=resident.id,
                        type="blood_pressure",
                        severity=severity,
                        message=f"Blood pressure alert: {vitals.blood_pressure_systolic}/{vitals.blood_pressure_diastolic} for {resident.name}",
                        timestamp=timestamp
                    )
                    db.add(alert)
                
                if vitals.temperature > 37.5 or vitals.temperature < 36.0:
                    severity = AlertSeverity.CRITICAL if vitals.temperature > 39.0 or vitals.temperature < 35.0 else AlertSeverity.HIGH
                    alert = Alert(
                        resident_id=resident.id,
                        type="temperature",
                        severity=severity,
                        message=f"Temperature alert: {vitals.temperature}°C for {resident.name}",
                        timestamp=timestamp
                    )
                    db.add(alert)
                
                if vitals.spo2 < 95:
                    severity = AlertSeverity.CRITICAL if vitals.spo2 < 90 else AlertSeverity.HIGH
                    alert = Alert(
                        resident_id=resident.id,
                        type="spo2",
                        severity=severity,
                        message=f"Low oxygen saturation: {vitals.spo2}% for {resident.name}",
                        timestamp=timestamp
                    )
                    db.add(alert)
                
                # Random occasional alerts (15% chance for more variety)
                if random.random() < 0.15 and day < 14:  # More recent alerts
                    alert_type, severity, message = generate_random_alert(resident, vitals)
                    if alert_type:
                        alert = Alert(
                            resident_id=resident.id,
                            type=alert_type,
                            severity=severity,
                            message=message,
                            timestamp=timestamp
                        )
                        db.add(alert)
    
    db.commit()
    
    # Count total vitals and alerts generated
    total_vitals = db.query(Vitals).count()
    total_alerts = db.query(Alert).count()
    
    # Count residents per facility before closing session
    facility_counts = {}
    for facility in facilities:
        count = db.query(Resident).filter(Resident.facility_id == facility.id).count()
        facility_counts[facility.name] = count
    
    db.close()
    
    print("✅ Enhanced Multi-Facility Demo Data Generated Successfully!")
    print(f"📊 Created {len(residents)} residents across {len(facilities)} facilities:")
    for facility_name, count in facility_counts.items():
        print(f"   • {facility_name}: {count} residents")
    print(f"\n📈 Data generated:")
    print(f"   • {total_vitals:,} vital readings (30 days of data)")
    print(f"   • {total_alerts} alerts (weekly patterns + random)")
    print(f"   • Realistic medical history variations")
    print(f"   • Time-based vital fluctuations")
    print("\n🔑 Login credentials:")
    print("   Global Admin: admin@seniorcare.com / admin123")
    print("   Facility Admins: admin1@seniorcare.com / admin123, admin2@seniorcare.com / admin123, etc.")
    print("\n🌐 Services:")
    print("   Backend API: http://localhost:8000")
    print("   Frontend: http://localhost:3000")
    print("   API Docs: http://localhost:8000/docs")

if __name__ == "__main__":
    generate_demo_data()