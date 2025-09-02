"""
Family Engagement System - Real-time updates and communication portal
"""

from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from enum import Enum
import json
from dataclasses import dataclass, asdict

class NotificationType(Enum):
    HEALTH_UPDATE = "health_update"
    ACTIVITY_UPDATE = "activity_update"
    MEDICATION = "medication"
    MEAL = "meal"
    VISITOR = "visitor"
    ALERT = "alert"
    MILESTONE = "milestone"
    PHOTO = "photo"
    VIDEO_CALL = "video_call"
    CARE_PLAN = "care_plan"

class NotificationPriority(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

@dataclass
class FamilyNotification:
    resident_id: int
    family_member_id: int
    type: NotificationType
    priority: NotificationPriority
    title: str
    message: str
    data: Optional[Dict] = None
    image_url: Optional[str] = None
    action_required: bool = False
    action_type: Optional[str] = None
    created_at: datetime = None
    read: bool = False
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.utcnow()

@dataclass
class DailyUpdate:
    resident_id: int
    date: datetime
    mood: str  # happy, content, anxious, sad
    activities: List[str]
    meals: Dict[str, str]  # breakfast, lunch, dinner -> eaten percentage
    vitals_summary: Dict[str, Any]
    social_interactions: int
    notable_events: List[str]
    photos: List[str]
    staff_notes: str

@dataclass
class FamilyPreferences:
    family_member_id: int
    notification_frequency: str  # real-time, hourly, daily, weekly
    notification_types: List[NotificationType]
    quiet_hours_start: int  # 0-23
    quiet_hours_end: int  # 0-23
    language: str
    timezone: str
    emergency_contact: bool
    photo_sharing: bool
    video_calls: bool

class FamilyEngagementService:
    """
    Manages family communication, updates, and engagement
    """
    
    def __init__(self):
        self.notification_queue = []
        self.family_preferences = {}
        
    def create_daily_update(self, resident_id: int, data: Dict) -> DailyUpdate:
        """
        Create a comprehensive daily update for family members
        """
        return DailyUpdate(
            resident_id=resident_id,
            date=datetime.utcnow(),
            mood=self._assess_mood(data),
            activities=data.get('activities', []),
            meals={
                'breakfast': f"{data.get('breakfast_eaten', 0)}%",
                'lunch': f"{data.get('lunch_eaten', 0)}%",
                'dinner': f"{data.get('dinner_eaten', 0)}%"
            },
            vitals_summary=self._summarize_vitals(data.get('vitals', [])),
            social_interactions=data.get('social_interactions', 0),
            notable_events=data.get('notable_events', []),
            photos=data.get('photos', []),
            staff_notes=data.get('staff_notes', '')
        )
    
    def send_notification(self, notification: FamilyNotification) -> bool:
        """
        Send notification to family member based on preferences
        """
        # Check family preferences
        prefs = self.family_preferences.get(notification.family_member_id)
        
        if not prefs:
            # Default preferences if not set
            self.notification_queue.append(notification)
            return True
        
        # Check if notification type is enabled
        if notification.type not in prefs.notification_types:
            return False
        
        # Check quiet hours
        current_hour = datetime.utcnow().hour
        if prefs.quiet_hours_start <= current_hour < prefs.quiet_hours_end:
            if notification.priority not in [NotificationPriority.HIGH, NotificationPriority.URGENT]:
                # Queue for later
                self.notification_queue.append(notification)
                return False
        
        # Send notification (in real implementation, this would use push notifications, SMS, email)
        self._dispatch_notification(notification, prefs)
        return True
    
    def generate_health_update(self, resident_id: int, preventive_score: Any) -> FamilyNotification:
        """
        Generate health update notification from preventive care score
        """
        priority = self._map_risk_to_priority(preventive_score.overall_risk_level)
        
        message = self._create_health_message(preventive_score)
        
        return FamilyNotification(
            resident_id=resident_id,
            family_member_id=0,  # Would be set per family member
            type=NotificationType.HEALTH_UPDATE,
            priority=priority,
            title=f"Health Update for {datetime.utcnow().strftime('%B %d')}",
            message=message,
            data={
                "risk_score": preventive_score.overall_risk_score,
                "risk_level": preventive_score.overall_risk_level.value,
                "quality_of_life": preventive_score.quality_of_life_score,
                "key_risks": [rf.category.value for rf in preventive_score.risk_factors[:3]]
            }
        )
    
    def create_activity_update(self, resident_id: int, activity: str, photo_url: Optional[str] = None) -> FamilyNotification:
        """
        Create activity update notification
        """
        return FamilyNotification(
            resident_id=resident_id,
            family_member_id=0,
            type=NotificationType.ACTIVITY_UPDATE,
            priority=NotificationPriority.LOW,
            title="Activity Update",
            message=f"Your loved one participated in {activity} today!",
            image_url=photo_url,
            data={"activity": activity, "timestamp": datetime.utcnow().isoformat()}
        )
    
    def create_meal_update(self, resident_id: int, meal_type: str, eaten_percentage: int) -> FamilyNotification:
        """
        Create meal update notification
        """
        emoji = "🥞" if meal_type == "breakfast" else "🍽️" if meal_type == "lunch" else "🍜"
        
        message = f"{emoji} {meal_type.capitalize()} update: {eaten_percentage}% eaten"
        if eaten_percentage < 50:
            message += ". Staff is monitoring nutrition intake."
            priority = NotificationPriority.MEDIUM
        else:
            message += ". Good appetite today!"
            priority = NotificationPriority.LOW
        
        return FamilyNotification(
            resident_id=resident_id,
            family_member_id=0,
            type=NotificationType.MEAL,
            priority=priority,
            title=f"{meal_type.capitalize()} Update",
            message=message,
            data={"meal_type": meal_type, "percentage": eaten_percentage}
        )
    
    def create_visitor_notification(self, resident_id: int, visitor_name: str, relation: str) -> FamilyNotification:
        """
        Notify family about visitors
        """
        return FamilyNotification(
            resident_id=resident_id,
            family_member_id=0,
            type=NotificationType.VISITOR,
            priority=NotificationPriority.LOW,
            title="Visitor Update",
            message=f"{visitor_name} ({relation}) visited today at {datetime.utcnow().strftime('%I:%M %p')}",
            data={"visitor": visitor_name, "relation": relation}
        )
    
    def create_milestone_notification(self, resident_id: int, milestone: str) -> FamilyNotification:
        """
        Create milestone celebration notification
        """
        return FamilyNotification(
            resident_id=resident_id,
            family_member_id=0,
            type=NotificationType.MILESTONE,
            priority=NotificationPriority.MEDIUM,
            title="🎉 Milestone Achieved!",
            message=milestone,
            data={"milestone": milestone, "date": datetime.utcnow().isoformat()}
        )
    
    def schedule_video_call(self, resident_id: int, family_member_id: int, scheduled_time: datetime) -> FamilyNotification:
        """
        Schedule and notify about video call
        """
        return FamilyNotification(
            resident_id=resident_id,
            family_member_id=family_member_id,
            type=NotificationType.VIDEO_CALL,
            priority=NotificationPriority.MEDIUM,
            title="Video Call Scheduled",
            message=f"Video call scheduled for {scheduled_time.strftime('%B %d at %I:%M %p')}",
            data={
                "scheduled_time": scheduled_time.isoformat(),
                "call_link": f"https://eldercare.video/call/{resident_id}-{family_member_id}"
            },
            action_required=True,
            action_type="join_call"
        )
    
    def generate_weekly_summary(self, resident_id: int, week_data: List[DailyUpdate]) -> Dict:
        """
        Generate weekly summary for family
        """
        if not week_data:
            return {}
        
        # Aggregate data
        total_activities = sum(len(d.activities) for d in week_data)
        avg_meal_consumption = {
            'breakfast': sum(int(d.meals['breakfast'].rstrip('%')) for d in week_data) / len(week_data),
            'lunch': sum(int(d.meals['lunch'].rstrip('%')) for d in week_data) / len(week_data),
            'dinner': sum(int(d.meals['dinner'].rstrip('%')) for d in week_data) / len(week_data)
        }
        
        mood_counts = {}
        for d in week_data:
            mood_counts[d.mood] = mood_counts.get(d.mood, 0) + 1
        
        most_common_mood = max(mood_counts, key=mood_counts.get)
        
        total_social = sum(d.social_interactions for d in week_data)
        all_notable_events = [event for d in week_data for event in d.notable_events]
        
        return {
            "week_ending": week_data[-1].date.isoformat(),
            "summary": {
                "predominant_mood": most_common_mood,
                "mood_breakdown": mood_counts,
                "total_activities": total_activities,
                "average_meal_consumption": avg_meal_consumption,
                "total_social_interactions": total_social,
                "notable_events": all_notable_events[:5],  # Top 5 events
                "health_status": "stable",  # Would be calculated from vitals
                "recommendation": self._generate_recommendation(week_data)
            },
            "highlights": self._extract_highlights(week_data),
            "concerns": self._identify_concerns(week_data),
            "photos": [photo for d in week_data for photo in d.photos][:10]  # Top 10 photos
        }
    
    def _assess_mood(self, data: Dict) -> str:
        """
        Assess resident's mood based on various factors
        """
        mood_score = 50  # Neutral start
        
        # Activity participation
        if data.get('activity_participation', False):
            mood_score += 10
        
        # Social interactions
        if data.get('social_interactions', 0) > 3:
            mood_score += 15
        elif data.get('social_interactions', 0) > 0:
            mood_score += 5
        
        # Meal consumption
        avg_meal = (data.get('breakfast_eaten', 0) + data.get('lunch_eaten', 0) + data.get('dinner_eaten', 0)) / 3
        if avg_meal > 75:
            mood_score += 10
        elif avg_meal < 50:
            mood_score -= 10
        
        # Sleep quality
        if data.get('sleep_quality', 'good') == 'good':
            mood_score += 10
        elif data.get('sleep_quality', 'good') == 'poor':
            mood_score -= 15
        
        # Map score to mood
        if mood_score >= 70:
            return "happy"
        elif mood_score >= 50:
            return "content"
        elif mood_score >= 30:
            return "anxious"
        else:
            return "sad"
    
    def _summarize_vitals(self, vitals: List[Dict]) -> Dict:
        """
        Create summary of vital signs
        """
        if not vitals:
            return {"status": "No data available"}
        
        latest = vitals[0] if vitals else {}
        
        summary = {
            "blood_pressure": f"{latest.get('blood_pressure_systolic', 'N/A')}/{latest.get('blood_pressure_diastolic', 'N/A')}",
            "heart_rate": latest.get('heart_rate', 'N/A'),
            "temperature": latest.get('temperature', 'N/A'),
            "oxygen": latest.get('spo2', 'N/A'),
            "status": "Normal"  # Would be calculated based on values
        }
        
        # Check for concerning values
        if latest.get('blood_pressure_systolic', 120) > 140:
            summary["status"] = "Elevated BP - Monitoring"
        elif latest.get('heart_rate', 70) > 100:
            summary["status"] = "Elevated heart rate - Monitoring"
        elif latest.get('spo2', 98) < 92:
            summary["status"] = "Low oxygen - Under care"
        
        return summary
    
    def _map_risk_to_priority(self, risk_level: Any) -> NotificationPriority:
        """
        Map risk level to notification priority
        """
        mapping = {
            "critical": NotificationPriority.URGENT,
            "high": NotificationPriority.HIGH,
            "moderate": NotificationPriority.MEDIUM,
            "low": NotificationPriority.LOW
        }
        return mapping.get(risk_level.value, NotificationPriority.MEDIUM)
    
    def _create_health_message(self, score: Any) -> str:
        """
        Create friendly health update message
        """
        if score.overall_risk_level.value == "low":
            return f"Good news! Your loved one's health indicators are stable. Quality of life score: {score.quality_of_life_score:.0f}/100"
        elif score.overall_risk_level.value == "moderate":
            return f"Your loved one is doing well overall. We're monitoring a few areas closely. Quality of life score: {score.quality_of_life_score:.0f}/100"
        elif score.overall_risk_level.value == "high":
            risks = ", ".join([rf.category.value.replace("_", " ") for rf in score.risk_factors[:2]])
            return f"We're providing extra attention in areas of {risks}. The care team is actively managing these concerns."
        else:
            return "The care team is providing intensive monitoring and care. We'll keep you updated on any changes."
    
    def _generate_recommendation(self, week_data: List[DailyUpdate]) -> str:
        """
        Generate recommendation for family based on week's data
        """
        avg_social = sum(d.social_interactions for d in week_data) / len(week_data)
        
        if avg_social < 2:
            return "Consider scheduling a visit or video call. Social interaction would be beneficial."
        
        mood_sad_count = sum(1 for d in week_data if d.mood == "sad")
        if mood_sad_count > 3:
            return "Your loved one might benefit from additional family engagement this week."
        
        return "Continue with regular visits and calls. Your engagement makes a difference!"
    
    def _extract_highlights(self, week_data: List[DailyUpdate]) -> List[str]:
        """
        Extract positive highlights from the week
        """
        highlights = []
        
        for day in week_data:
            if day.mood == "happy":
                highlights.append(f"Had a great day on {day.date.strftime('%A')}")
            if len(day.activities) > 3:
                highlights.append(f"Very active on {day.date.strftime('%A')} with {len(day.activities)} activities")
            for event in day.notable_events:
                if "birthday" in event.lower() or "celebration" in event.lower():
                    highlights.append(event)
        
        return highlights[:5]  # Top 5 highlights
    
    def _identify_concerns(self, week_data: List[DailyUpdate]) -> List[str]:
        """
        Identify concerning patterns
        """
        concerns = []
        
        # Check meal consumption
        low_meal_days = sum(1 for d in week_data 
                           if int(d.meals['breakfast'].rstrip('%')) < 50 
                           or int(d.meals['lunch'].rstrip('%')) < 50)
        if low_meal_days > 3:
            concerns.append("Reduced appetite observed on multiple days")
        
        # Check mood patterns
        negative_mood_days = sum(1 for d in week_data if d.mood in ["sad", "anxious"])
        if negative_mood_days > 4:
            concerns.append("Mood has been lower than usual this week")
        
        # Check social interaction
        low_social_days = sum(1 for d in week_data if d.social_interactions < 2)
        if low_social_days > 4:
            concerns.append("Limited social interaction this week")
        
        return concerns
    
    def _dispatch_notification(self, notification: FamilyNotification, preferences: FamilyPreferences):
        """
        Actually send the notification (placeholder for real implementation)
        """
        # In real implementation, this would:
        # - Send push notification via Firebase/APNs
        # - Send SMS via Twilio
        # - Send email via SendGrid
        # - Update notification log in database
        
        print(f"Sending {notification.type.value} notification to family member {notification.family_member_id}")
        print(f"Title: {notification.title}")
        print(f"Message: {notification.message}")