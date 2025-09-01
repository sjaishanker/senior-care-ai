from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.database import Base
import enum

class AlertSeverity(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    STAFF = "staff"
    FAMILY = "family"
    DOCTOR = "doctor"

class Facility(Base):
    __tablename__ = "facilities"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(Text)
    capacity = Column(Integer)
    contact_number = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    residents = relationship("Resident", back_populates="facility")
    users = relationship("User", back_populates="facility")

class Resident(Base):
    __tablename__ = "residents"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer)
    room_number = Column(String)
    medical_history = Column(Text)
    emergency_contact = Column(String)
    emergency_contact_name = Column(String)
    facility_id = Column(Integer, ForeignKey("facilities.id"))
    admission_date = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    facility = relationship("Facility", back_populates="residents")
    vitals = relationship("Vitals", back_populates="resident")
    alerts = relationship("Alert", back_populates="resident")

class Vitals(Base):
    __tablename__ = "vitals"
    
    id = Column(Integer, primary_key=True, index=True)
    resident_id = Column(Integer, ForeignKey("residents.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    heart_rate = Column(Float)
    blood_pressure_systolic = Column(Float)
    blood_pressure_diastolic = Column(Float)
    temperature = Column(Float)
    spo2 = Column(Float)
    respiratory_rate = Column(Float)
    
    resident = relationship("Resident", back_populates="vitals")

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    resident_id = Column(Integer, ForeignKey("residents.id"))
    type = Column(String)
    severity = Column(Enum(AlertSeverity))
    message = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    resolved = Column(Boolean, default=False)
    resolved_at = Column(DateTime, nullable=True)
    resolved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    resident = relationship("Resident", back_populates="alerts")

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole))
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    facility = relationship("Facility", back_populates="users")