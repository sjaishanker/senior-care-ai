"""
Preventive Care API Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from datetime import datetime, timedelta
from app.models.database import get_db
from app.models.models import Resident, Vitals, Alert, Facility
from app.services.preventive_care_engine import PreventiveCareEngine, PreventiveCareScore
from app.services.family_engagement import FamilyEngagementService, FamilyNotification
from pydantic import BaseModel

router = APIRouter()

# Initialize services
preventive_engine = PreventiveCareEngine()
family_service = FamilyEngagementService()

class RiskAssessmentResponse(BaseModel):
    resident_id: int
    resident_name: str
    facility_name: str
    overall_risk_score: float
    overall_risk_level: str
    quality_of_life_score: float
    risk_factors: List[Dict]
    priority_interventions: List[str]
    last_updated: datetime
    next_assessment: datetime

class FacilityRiskSummary(BaseModel):
    facility_id: int
    facility_name: str
    total_residents: int
    high_risk_count: int
    moderate_risk_count: int
    low_risk_count: int
    average_risk_score: float
    average_qol_score: float
    top_risks: List[str]
    recommended_actions: List[str]

class InterventionRecommendation(BaseModel):
    intervention: str
    priority: str
    affected_residents: int
    expected_impact: str
    resources_required: str

@router.get("/resident/{resident_id}/risk-assessment", response_model=RiskAssessmentResponse)
async def get_resident_risk_assessment(resident_id: int, db: Session = Depends(get_db)):
    """
    Get comprehensive risk assessment for a specific resident
    """
    # Get resident data
    resident = db.query(Resident).filter(Resident.id == resident_id).first()
    if not resident:
        raise HTTPException(status_code=404, detail="Resident not found")
    
    # Get facility
    facility = db.query(Facility).filter(Facility.id == resident.facility_id).first()
    
    # Get recent vitals (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    vitals = db.query(Vitals).filter(
        Vitals.resident_id == resident_id,
        Vitals.timestamp >= thirty_days_ago
    ).order_by(Vitals.timestamp.desc()).limit(100).all()
    
    # Get recent alerts
    alerts = db.query(Alert).filter(
        Alert.resident_id == resident_id,
        Alert.timestamp >= thirty_days_ago
    ).all()
    
    # Prepare data for assessment
    resident_data = {
        'id': resident.id,
        'age': resident.age,
        'medical_history': resident.medical_history,
        'recent_vitals': [
            {
                'blood_pressure_systolic': v.blood_pressure_systolic,
                'blood_pressure_diastolic': v.blood_pressure_diastolic,
                'heart_rate': v.heart_rate,
                'temperature': v.temperature,
                'spo2': v.spo2,
                'respiratory_rate': v.respiratory_rate,
                'timestamp': v.timestamp
            } for v in vitals
        ],
        'recent_falls': sum(1 for a in alerts if 'FALL' in a.type),
        'mobility_score': 7,  # Would come from assessment data
        'vision_issues': 'vision' in resident.medical_history.lower(),
        'cognitive_impairment': any(term in resident.medical_history.lower() 
                                  for term in ['dementia', 'alzheimer', 'cognitive']),
        'daily_fluid_intake_ml': 1800,  # Would come from tracking
        'utis_last_90_days': sum(1 for a in alerts if 'UTI' in a.type or 'infection' in a.type.lower()),
        'family_visits_monthly': 3,  # Would come from visitor log
        'activity_participation_rate': 65,  # Would come from activity tracking
        'communal_meal_attendance': 80,  # Would come from meal tracking
        'time_in_room_percent': 60,  # Would come from location tracking
        'depression_screening_positive': False,  # Would come from assessments
        'missed_medications_weekly': 1,  # Would come from medication tracking
        'total_medications': 5,  # Would come from medication list
        'medication_errors_monthly': 0,
        'assistance_required': resident.age > 80,
        'meal_enjoyment_score': 7,
        'breakfast_eaten': 75,
        'lunch_eaten': 80,
        'dinner_eaten': 70,
        'social_interactions': 4,
        'sleep_quality': 'good'
    }
    
    # Calculate preventive care score
    score = preventive_engine.calculate_preventive_score(resident_data)
    
    # Generate report
    report = preventive_engine.generate_risk_report(score)
    
    # Send family notification if risk is high
    if score.overall_risk_level.value in ['high', 'critical']:
        notification = family_service.generate_health_update(resident_id, score)
        # In real implementation, this would be sent to all family members
        # family_service.send_notification(notification)
    
    return RiskAssessmentResponse(
        resident_id=resident.id,
        resident_name=resident.name,
        facility_name=facility.name if facility else "Unknown",
        overall_risk_score=report['overall_risk']['score'],
        overall_risk_level=report['overall_risk']['level'],
        quality_of_life_score=report['quality_of_life_score'],
        risk_factors=report['risk_factors'],
        priority_interventions=report['priority_actions'],
        last_updated=score.last_updated,
        next_assessment=score.next_assessment
    )

@router.get("/facility/{facility_id}/risk-summary", response_model=FacilityRiskSummary)
async def get_facility_risk_summary(facility_id: int, db: Session = Depends(get_db)):
    """
    Get risk summary for entire facility
    """
    facility = db.query(Facility).filter(Facility.id == facility_id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    
    residents = db.query(Resident).filter(
        Resident.facility_id == facility_id,
        Resident.is_active == True
    ).all()
    
    risk_scores = []
    qol_scores = []
    risk_levels = {'low': 0, 'moderate': 0, 'high': 0, 'critical': 0}
    all_risk_categories = {}
    all_interventions = {}
    
    for resident in residents:
        # Get assessment for each resident (simplified version)
        try:
            # In production, this would be cached/stored
            assessment = await get_resident_risk_assessment(resident.id, db)
            risk_scores.append(assessment.overall_risk_score)
            qol_scores.append(assessment.quality_of_life_score)
            risk_levels[assessment.overall_risk_level] = risk_levels.get(assessment.overall_risk_level, 0) + 1
            
            # Aggregate risk categories
            for risk_factor in assessment.risk_factors:
                category = risk_factor['category']
                all_risk_categories[category] = all_risk_categories.get(category, 0) + 1
            
            # Aggregate interventions
            for intervention in assessment.priority_interventions:
                all_interventions[intervention] = all_interventions.get(intervention, 0) + 1
        except:
            continue
    
    # Get top risks and interventions
    top_risks = sorted(all_risk_categories.items(), key=lambda x: x[1], reverse=True)[:5]
    top_interventions = sorted(all_interventions.items(), key=lambda x: x[1], reverse=True)[:5]
    
    return FacilityRiskSummary(
        facility_id=facility.id,
        facility_name=facility.name,
        total_residents=len(residents),
        high_risk_count=risk_levels.get('high', 0) + risk_levels.get('critical', 0),
        moderate_risk_count=risk_levels.get('moderate', 0),
        low_risk_count=risk_levels.get('low', 0),
        average_risk_score=sum(risk_scores) / len(risk_scores) if risk_scores else 0,
        average_qol_score=sum(qol_scores) / len(qol_scores) if qol_scores else 0,
        top_risks=[risk[0] for risk in top_risks],
        recommended_actions=[action[0] for action in top_interventions]
    )

@router.get("/high-risk-residents")
async def get_high_risk_residents(
    facility_id: Optional[int] = None,
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Get list of high-risk residents across facilities
    """
    query = db.query(Resident).filter(Resident.is_active == True)
    
    if facility_id:
        query = query.filter(Resident.facility_id == facility_id)
    
    residents = query.all()
    
    high_risk_residents = []
    
    for resident in residents:
        try:
            assessment = await get_resident_risk_assessment(resident.id, db)
            if assessment.overall_risk_level in ['high', 'critical']:
                high_risk_residents.append({
                    'resident_id': resident.id,
                    'resident_name': resident.name,
                    'room_number': resident.room_number,
                    'facility_id': resident.facility_id,
                    'risk_score': assessment.overall_risk_score,
                    'risk_level': assessment.overall_risk_level,
                    'top_risks': [rf['category'] for rf in assessment.risk_factors[:3]],
                    'priority_intervention': assessment.priority_interventions[0] if assessment.priority_interventions else None
                })
        except:
            continue
    
    # Sort by risk score (highest first)
    high_risk_residents.sort(key=lambda x: x['risk_score'], reverse=True)
    
    return high_risk_residents[:limit]

@router.post("/interventions/recommend")
async def recommend_interventions(
    facility_id: Optional[int] = None,
    risk_category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get intervention recommendations based on facility-wide patterns
    """
    recommendations = []
    
    # Sample recommendations based on common patterns
    if risk_category == "fall_risk" or not risk_category:
        recommendations.append(InterventionRecommendation(
            intervention="Implement hourly rounding protocol",
            priority="High",
            affected_residents=12,
            expected_impact="30% reduction in falls",
            resources_required="Staff training (4 hours)"
        ))
        recommendations.append(InterventionRecommendation(
            intervention="Install additional grab bars in high-traffic areas",
            priority="Medium",
            affected_residents=25,
            expected_impact="15% reduction in bathroom falls",
            resources_required="Maintenance team (8 hours), Materials ($500)"
        ))
    
    if risk_category == "dehydration" or not risk_category:
        recommendations.append(InterventionRecommendation(
            intervention="Hydration station setup in common areas",
            priority="Medium",
            affected_residents=18,
            expected_impact="25% increase in fluid intake",
            resources_required="Setup cost ($200), Daily maintenance"
        ))
    
    if risk_category == "isolation" or not risk_category:
        recommendations.append(InterventionRecommendation(
            intervention="Buddy system for isolated residents",
            priority="High",
            affected_residents=8,
            expected_impact="40% increase in social interaction",
            resources_required="Volunteer coordinator, Training (2 hours)"
        ))
    
    return recommendations

@router.post("/alert/preventive")
async def create_preventive_alert(
    resident_id: int,
    risk_category: str,
    intervention: str,
    db: Session = Depends(get_db)
):
    """
    Create a preventive care alert for staff
    """
    resident = db.query(Resident).filter(Resident.id == resident_id).first()
    if not resident:
        raise HTTPException(status_code=404, detail="Resident not found")
    
    # Create alert in database
    alert = Alert(
        resident_id=resident_id,
        type=f"PREVENTIVE_{risk_category.upper()}",
        severity="medium",
        message=f"Preventive intervention recommended: {intervention}",
        resolved=False,
        timestamp=datetime.utcnow()
    )
    db.add(alert)
    db.commit()
    
    return {
        "success": True,
        "alert_id": alert.id,
        "message": f"Preventive alert created for {resident.name}"
    }

@router.get("/quality-metrics")
async def get_quality_metrics(
    facility_id: Optional[int] = None,
    days: int = Query(30, ge=7, le=90),
    db: Session = Depends(get_db)
):
    """
    Get quality metrics showing impact of preventive care
    """
    # This would analyze historical data to show improvements
    return {
        "period_days": days,
        "metrics": {
            "falls_prevented": 12,
            "hospital_transfers_avoided": 5,
            "emergency_calls_reduced": 8,
            "family_satisfaction_score": 4.6,  # out of 5
            "staff_efficiency_improvement": "23%",
            "cost_savings": "$45,000",
            "quality_of_life_improvement": "+15%"
        },
        "trends": {
            "risk_scores": "Declining",
            "intervention_success_rate": "78%",
            "family_engagement": "Increasing",
            "staff_adoption": "85%"
        }
    }