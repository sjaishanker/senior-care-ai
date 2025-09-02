"""
Preventive Care Engine - Core risk assessment and early intervention system
"""

from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
from enum import Enum
import statistics
from dataclasses import dataclass

class RiskLevel(Enum):
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    CRITICAL = "critical"

class RiskCategory(Enum):
    FALL_RISK = "fall_risk"
    DEHYDRATION = "dehydration"
    MALNUTRITION = "malnutrition"
    ISOLATION = "isolation"
    MEDICATION_NON_ADHERENCE = "medication_non_adherence"
    INFECTION = "infection"
    COGNITIVE_DECLINE = "cognitive_decline"
    CARDIOVASCULAR = "cardiovascular"

@dataclass
class RiskFactor:
    category: RiskCategory
    score: float  # 0-100
    level: RiskLevel
    contributing_factors: List[str]
    recommended_interventions: List[str]
    confidence: float  # 0-1

@dataclass
class PreventiveCareScore:
    resident_id: int
    overall_risk_score: float  # 0-100
    overall_risk_level: RiskLevel
    risk_factors: List[RiskFactor]
    quality_of_life_score: float  # 0-100
    last_updated: datetime
    next_assessment: datetime
    priority_interventions: List[str]

class PreventiveCareEngine:
    """
    Advanced risk assessment engine that analyzes multiple data points
    to predict and prevent health issues before they become critical
    """
    
    def __init__(self):
        self.thresholds = {
            RiskLevel.LOW: (0, 30),
            RiskLevel.MODERATE: (30, 60),
            RiskLevel.HIGH: (60, 80),
            RiskLevel.CRITICAL: (80, 100)
        }
    
    def calculate_preventive_score(self, resident_data: Dict) -> PreventiveCareScore:
        """
        Calculate comprehensive preventive care score for a resident
        """
        risk_factors = []
        
        # Assess each risk category
        fall_risk = self._assess_fall_risk(resident_data)
        if fall_risk:
            risk_factors.append(fall_risk)
        
        dehydration_risk = self._assess_dehydration_risk(resident_data)
        if dehydration_risk:
            risk_factors.append(dehydration_risk)
        
        isolation_risk = self._assess_isolation_risk(resident_data)
        if isolation_risk:
            risk_factors.append(isolation_risk)
        
        medication_risk = self._assess_medication_adherence(resident_data)
        if medication_risk:
            risk_factors.append(medication_risk)
        
        cardiovascular_risk = self._assess_cardiovascular_risk(resident_data)
        if cardiovascular_risk:
            risk_factors.append(cardiovascular_risk)
        
        # Calculate overall risk score
        overall_score = self._calculate_overall_score(risk_factors)
        overall_level = self._get_risk_level(overall_score)
        
        # Calculate quality of life score
        qol_score = self._calculate_quality_of_life(resident_data)
        
        # Get priority interventions
        priority_interventions = self._get_priority_interventions(risk_factors)
        
        return PreventiveCareScore(
            resident_id=resident_data['id'],
            overall_risk_score=overall_score,
            overall_risk_level=overall_level,
            risk_factors=risk_factors,
            quality_of_life_score=qol_score,
            last_updated=datetime.utcnow(),
            next_assessment=datetime.utcnow() + timedelta(hours=6),
            priority_interventions=priority_interventions[:5]  # Top 5 interventions
        )
    
    def _assess_fall_risk(self, data: Dict) -> Optional[RiskFactor]:
        """
        Assess fall risk based on multiple factors
        """
        score = 0
        factors = []
        interventions = []
        
        # Age factor
        age = data.get('age', 0)
        if age > 85:
            score += 20
            factors.append("Age over 85")
        elif age > 75:
            score += 10
            factors.append("Age over 75")
        
        # Recent falls
        recent_falls = data.get('recent_falls', 0)
        if recent_falls > 2:
            score += 30
            factors.append(f"{recent_falls} falls in last 30 days")
            interventions.append("Immediate fall prevention protocol")
        elif recent_falls > 0:
            score += 15
            factors.append(f"{recent_falls} fall(s) in last 30 days")
            interventions.append("Fall risk assessment by PT")
        
        # Mobility issues
        if data.get('mobility_score', 10) < 5:
            score += 25
            factors.append("Limited mobility")
            interventions.append("Physical therapy consultation")
            interventions.append("Assistive device evaluation")
        
        # Medication factors
        high_risk_meds = data.get('high_risk_medications', [])
        if len(high_risk_meds) > 3:
            score += 15
            factors.append(f"Taking {len(high_risk_meds)} high-risk medications")
            interventions.append("Medication review by pharmacist")
        
        # Vision problems
        if data.get('vision_issues', False):
            score += 10
            factors.append("Vision impairment")
            interventions.append("Vision assessment")
        
        # Balance issues from vitals
        vitals = data.get('recent_vitals', [])
        if vitals:
            bp_variations = self._check_orthostatic_hypotension(vitals)
            if bp_variations:
                score += 20
                factors.append("Orthostatic hypotension detected")
                interventions.append("Blood pressure management review")
        
        if score > 0:
            return RiskFactor(
                category=RiskCategory.FALL_RISK,
                score=min(score, 100),
                level=self._get_risk_level(score),
                contributing_factors=factors,
                recommended_interventions=interventions,
                confidence=0.85
            )
        return None
    
    def _assess_dehydration_risk(self, data: Dict) -> Optional[RiskFactor]:
        """
        Assess dehydration risk
        """
        score = 0
        factors = []
        interventions = []
        
        # Fluid intake monitoring
        daily_fluid_intake = data.get('daily_fluid_intake_ml', 2000)
        if daily_fluid_intake < 1000:
            score += 30
            factors.append(f"Low fluid intake: {daily_fluid_intake}ml/day")
            interventions.append("Increase fluid monitoring")
            interventions.append("Hydration reminders every 2 hours")
        elif daily_fluid_intake < 1500:
            score += 15
            factors.append(f"Below optimal fluid intake: {daily_fluid_intake}ml/day")
            interventions.append("Encourage fluid intake")
        
        # Recent UTIs (indicator of chronic dehydration)
        recent_utis = data.get('utis_last_90_days', 0)
        if recent_utis > 1:
            score += 25
            factors.append(f"{recent_utis} UTIs in last 90 days")
            interventions.append("Urine analysis")
        
        # Vital signs indicating dehydration
        vitals = data.get('recent_vitals', [])
        if vitals:
            latest_vital = vitals[0]
            # Low blood pressure
            if latest_vital.get('blood_pressure_systolic', 120) < 90:
                score += 20
                factors.append("Low blood pressure")
            # Elevated heart rate
            if latest_vital.get('heart_rate', 70) > 100:
                score += 15
                factors.append("Elevated heart rate")
        
        # Cognitive factors affecting hydration
        if data.get('cognitive_impairment', False):
            score += 15
            factors.append("Cognitive impairment affecting self-care")
            interventions.append("Structured hydration schedule")
        
        if score > 0:
            return RiskFactor(
                category=RiskCategory.DEHYDRATION,
                score=min(score, 100),
                level=self._get_risk_level(score),
                contributing_factors=factors,
                recommended_interventions=interventions,
                confidence=0.78
            )
        return None
    
    def _assess_isolation_risk(self, data: Dict) -> Optional[RiskFactor]:
        """
        Assess social isolation risk
        """
        score = 0
        factors = []
        interventions = []
        
        # Family visits
        family_visits_monthly = data.get('family_visits_monthly', 0)
        if family_visits_monthly == 0:
            score += 30
            factors.append("No family visits in past month")
            interventions.append("Family engagement outreach")
            interventions.append("Video call setup with family")
        elif family_visits_monthly < 2:
            score += 15
            factors.append(f"Only {family_visits_monthly} family visit(s) per month")
            interventions.append("Encourage family visits")
        
        # Activity participation
        activity_participation = data.get('activity_participation_rate', 100)
        if activity_participation < 20:
            score += 25
            factors.append(f"Low activity participation: {activity_participation}%")
            interventions.append("Personalized activity plan")
            interventions.append("One-on-one engagement sessions")
        elif activity_participation < 50:
            score += 10
            factors.append(f"Below average activity participation: {activity_participation}%")
        
        # Meal attendance
        meal_attendance = data.get('communal_meal_attendance', 100)
        if meal_attendance < 30:
            score += 20
            factors.append("Frequently misses communal meals")
            interventions.append("Meal companion program")
        
        # Room time
        time_in_room_percent = data.get('time_in_room_percent', 50)
        if time_in_room_percent > 85:
            score += 15
            factors.append("Spends excessive time alone in room")
            interventions.append("Social worker consultation")
        
        # Depression indicators
        if data.get('depression_screening_positive', False):
            score += 20
            factors.append("Positive depression screening")
            interventions.append("Mental health assessment")
            interventions.append("Therapy sessions")
        
        if score > 0:
            return RiskFactor(
                category=RiskCategory.ISOLATION,
                score=min(score, 100),
                level=self._get_risk_level(score),
                contributing_factors=factors,
                recommended_interventions=interventions,
                confidence=0.82
            )
        return None
    
    def _assess_medication_adherence(self, data: Dict) -> Optional[RiskFactor]:
        """
        Assess medication adherence risk
        """
        score = 0
        factors = []
        interventions = []
        
        # Missed medications
        missed_meds_weekly = data.get('missed_medications_weekly', 0)
        if missed_meds_weekly > 3:
            score += 35
            factors.append(f"Missed {missed_meds_weekly} medications this week")
            interventions.append("Medication administration review")
            interventions.append("Simplified medication schedule")
        elif missed_meds_weekly > 0:
            score += 15
            factors.append(f"Missed {missed_meds_weekly} medication(s) this week")
        
        # Complexity of medication regimen
        total_medications = data.get('total_medications', 0)
        if total_medications > 10:
            score += 20
            factors.append(f"Complex regimen: {total_medications} medications")
            interventions.append("Medication consolidation review")
        elif total_medications > 5:
            score += 10
            factors.append(f"Multiple medications: {total_medications}")
        
        # Cognitive factors
        if data.get('cognitive_impairment', False):
            score += 25
            factors.append("Cognitive impairment affecting adherence")
            interventions.append("Medication reminders")
            interventions.append("Supervised administration")
        
        # Recent medication errors
        med_errors = data.get('medication_errors_monthly', 0)
        if med_errors > 0:
            score += 20
            factors.append(f"{med_errors} medication error(s) this month")
            interventions.append("Staff retraining on medication protocol")
        
        if score > 0:
            return RiskFactor(
                category=RiskCategory.MEDICATION_NON_ADHERENCE,
                score=min(score, 100),
                level=self._get_risk_level(score),
                contributing_factors=factors,
                recommended_interventions=interventions,
                confidence=0.88
            )
        return None
    
    def _assess_cardiovascular_risk(self, data: Dict) -> Optional[RiskFactor]:
        """
        Assess cardiovascular risk
        """
        score = 0
        factors = []
        interventions = []
        
        vitals = data.get('recent_vitals', [])
        if not vitals:
            return None
        
        # Analyze recent vital trends
        recent_vitals = vitals[:10]  # Last 10 readings
        
        # Blood pressure analysis
        systolic_values = [v.get('blood_pressure_systolic', 120) for v in recent_vitals]
        avg_systolic = statistics.mean(systolic_values)
        
        if avg_systolic > 160:
            score += 30
            factors.append(f"High average BP: {avg_systolic:.0f} mmHg")
            interventions.append("Immediate BP management review")
            interventions.append("Cardiology consultation")
        elif avg_systolic > 140:
            score += 15
            factors.append(f"Elevated average BP: {avg_systolic:.0f} mmHg")
            interventions.append("BP medication adjustment")
        
        # Heart rate irregularities
        heart_rates = [v.get('heart_rate', 70) for v in recent_vitals]
        hr_variance = statistics.stdev(heart_rates) if len(heart_rates) > 1 else 0
        
        if hr_variance > 20:
            score += 25
            factors.append("Irregular heart rate pattern")
            interventions.append("ECG monitoring")
        
        # Risk factors from medical history
        if "cardiac" in data.get('medical_history', '').lower():
            score += 20
            factors.append("Previous cardiac history")
        
        if "diabetes" in data.get('medical_history', '').lower():
            score += 15
            factors.append("Diabetes (cardiovascular risk factor)")
        
        # Oxygen saturation
        spo2_values = [v.get('spo2', 98) for v in recent_vitals if v.get('spo2')]
        if spo2_values:
            avg_spo2 = statistics.mean(spo2_values)
            if avg_spo2 < 92:
                score += 20
                factors.append(f"Low oxygen saturation: {avg_spo2:.0f}%")
                interventions.append("Oxygen therapy evaluation")
        
        if score > 0:
            return RiskFactor(
                category=RiskCategory.CARDIOVASCULAR,
                score=min(score, 100),
                level=self._get_risk_level(score),
                contributing_factors=factors,
                recommended_interventions=interventions,
                confidence=0.83
            )
        return None
    
    def _check_orthostatic_hypotension(self, vitals: List[Dict]) -> bool:
        """
        Check for orthostatic hypotension patterns
        """
        if len(vitals) < 2:
            return False
        
        # Look for significant BP drops
        for i in range(len(vitals) - 1):
            bp_drop = vitals[i].get('blood_pressure_systolic', 120) - vitals[i+1].get('blood_pressure_systolic', 120)
            if bp_drop > 20:
                return True
        return False
    
    def _calculate_overall_score(self, risk_factors: List[RiskFactor]) -> float:
        """
        Calculate weighted overall risk score
        """
        if not risk_factors:
            return 0
        
        # Weight critical risks higher
        weights = {
            RiskLevel.CRITICAL: 1.5,
            RiskLevel.HIGH: 1.2,
            RiskLevel.MODERATE: 1.0,
            RiskLevel.LOW: 0.8
        }
        
        weighted_sum = sum(rf.score * weights[rf.level] for rf in risk_factors)
        weighted_count = sum(weights[rf.level] for rf in risk_factors)
        
        return min(weighted_sum / weighted_count if weighted_count > 0 else 0, 100)
    
    def _calculate_quality_of_life(self, data: Dict) -> float:
        """
        Calculate quality of life score (higher is better)
        """
        score = 100  # Start with perfect score and deduct
        
        # Physical health
        if data.get('mobility_score', 10) < 5:
            score -= 15
        
        # Social engagement
        if data.get('activity_participation_rate', 100) < 30:
            score -= 20
        elif data.get('activity_participation_rate', 100) < 60:
            score -= 10
        
        # Family connection
        if data.get('family_visits_monthly', 0) == 0:
            score -= 15
        
        # Independence
        if data.get('assistance_required', False):
            score -= 10
        
        # Mental health
        if data.get('depression_screening_positive', False):
            score -= 20
        
        # Nutrition
        if data.get('meal_enjoyment_score', 10) < 5:
            score -= 10
        
        return max(score, 0)
    
    def _get_risk_level(self, score: float) -> RiskLevel:
        """
        Convert numerical score to risk level
        """
        for level, (min_score, max_score) in self.thresholds.items():
            if min_score <= score < max_score:
                return level
        return RiskLevel.CRITICAL if score >= 80 else RiskLevel.LOW
    
    def _get_priority_interventions(self, risk_factors: List[RiskFactor]) -> List[str]:
        """
        Get priority interventions based on risk factors
        """
        all_interventions = []
        
        # Sort risk factors by score (highest risk first)
        sorted_factors = sorted(risk_factors, key=lambda x: x.score, reverse=True)
        
        for factor in sorted_factors:
            all_interventions.extend(factor.recommended_interventions)
        
        # Remove duplicates while preserving order
        seen = set()
        priority_interventions = []
        for intervention in all_interventions:
            if intervention not in seen:
                seen.add(intervention)
                priority_interventions.append(intervention)
        
        return priority_interventions

    def generate_risk_report(self, score: PreventiveCareScore) -> Dict:
        """
        Generate a comprehensive risk report for sharing
        """
        return {
            "resident_id": score.resident_id,
            "report_date": score.last_updated.isoformat(),
            "overall_risk": {
                "score": round(score.overall_risk_score, 1),
                "level": score.overall_risk_level.value,
                "trend": "stable"  # This would be calculated from historical data
            },
            "quality_of_life_score": round(score.quality_of_life_score, 1),
            "risk_factors": [
                {
                    "category": rf.category.value,
                    "score": round(rf.score, 1),
                    "level": rf.level.value,
                    "factors": rf.contributing_factors,
                    "interventions": rf.recommended_interventions
                }
                for rf in sorted(score.risk_factors, key=lambda x: x.score, reverse=True)
            ],
            "priority_actions": score.priority_interventions,
            "next_assessment": score.next_assessment.isoformat()
        }