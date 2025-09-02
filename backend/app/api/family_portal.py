"""
Family Portal API Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from datetime import datetime, timedelta
from app.models.database import get_db
from app.models.models import Resident, Vitals, Alert, Facility
from app.services.family_engagement import (
    FamilyEngagementService, 
    FamilyNotification,
    DailyUpdate,
    NotificationType,
    NotificationPriority
)
from pydantic import BaseModel
import json

router = APIRouter()

# Initialize service
family_service = FamilyEngagementService()

class FamilyMemberRegister(BaseModel):
    resident_id: int
    name: str
    relationship: str
    email: str
    phone: str
    emergency_contact: bool = False
    notification_preferences: Dict

class DailyUpdateResponse(BaseModel):
    date: str
    mood: str
    mood_emoji: str
    activities: List[str]
    meals: Dict[str, str]
    vitals_summary: Dict
    social_interactions: int
    notable_events: List[str]
    photos: List[str]
    staff_notes: str
    health_status: str

class WeeklySummaryResponse(BaseModel):
    week_ending: str
    predominant_mood: str
    mood_breakdown: Dict[str, int]
    total_activities: int
    average_meal_consumption: Dict[str, float]
    total_social_interactions: int
    notable_events: List[str]
    health_status: str
    highlights: List[str]
    concerns: List[str]
    recommendation: str
    photos: List[str]

class NotificationResponse(BaseModel):
    id: int
    type: str
    priority: str
    title: str
    message: str
    timestamp: str
    read: bool
    data: Optional[Dict]
    image_url: Optional[str]
    action_required: bool
    action_type: Optional[str]

class VideoCallSchedule(BaseModel):
    resident_id: int
    family_member_id: int
    scheduled_time: datetime
    duration_minutes: int = 30
    notes: Optional[str]

@router.get("/resident/{resident_id}/today")
async def get_todays_update(resident_id: int, db: Session = Depends(get_db)):
    """
    Get today's update for a resident
    """
    resident = db.query(Resident).filter(Resident.id == resident_id).first()
    if not resident:
        raise HTTPException(status_code=404, detail="Resident not found")
    
    # Get today's data
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Get vitals
    vitals = db.query(Vitals).filter(
        Vitals.resident_id == resident_id,
        Vitals.timestamp >= today_start
    ).order_by(Vitals.timestamp.desc()).all()
    
    # Get alerts
    alerts = db.query(Alert).filter(
        Alert.resident_id == resident_id,
        Alert.timestamp >= today_start
    ).all()
    
    # Simulate daily data (in production, this would come from actual tracking)
    daily_data = {
        'activities': ['Morning exercise', 'Art therapy', 'Garden walk', 'Bingo'],
        'breakfast_eaten': 80,
        'lunch_eaten': 75,
        'dinner_eaten': 90,
        'vitals': [
            {
                'blood_pressure_systolic': v.blood_pressure_systolic,
                'blood_pressure_diastolic': v.blood_pressure_diastolic,
                'heart_rate': v.heart_rate,
                'temperature': v.temperature,
                'spo2': v.spo2
            } for v in vitals
        ],
        'social_interactions': 5,
        'notable_events': ['Participated enthusiastically in art therapy', 'Had video call with grandson'],
        'photos': ['/photos/art_therapy_today.jpg', '/photos/garden_walk.jpg'],
        'staff_notes': 'Had a great day! Very engaged in activities and good appetite.',
        'activity_participation': True,
        'sleep_quality': 'good'
    }
    
    # Create daily update
    update = family_service.create_daily_update(resident_id, daily_data)
    
    # Map mood to emoji
    mood_emojis = {
        'happy': '😊',
        'content': '🙂',
        'anxious': '😟',
        'sad': '😢'
    }
    
    # Determine health status
    health_status = "Stable"
    if any(a.severity in ['high', 'critical'] for a in alerts):
        health_status = "Under monitoring"
    
    return DailyUpdateResponse(
        date=update.date.strftime("%B %d, %Y"),
        mood=update.mood,
        mood_emoji=mood_emojis.get(update.mood, '🙂'),
        activities=update.activities,
        meals=update.meals,
        vitals_summary=update.vitals_summary,
        social_interactions=update.social_interactions,
        notable_events=update.notable_events,
        photos=update.photos,
        staff_notes=update.staff_notes,
        health_status=health_status
    )

@router.get("/resident/{resident_id}/weekly-summary")
async def get_weekly_summary(resident_id: int, db: Session = Depends(get_db)):
    """
    Get weekly summary for a resident
    """
    resident = db.query(Resident).filter(Resident.id == resident_id).first()
    if not resident:
        raise HTTPException(status_code=404, detail="Resident not found")
    
    # Generate week's data (simplified)
    week_data = []
    for i in range(7):
        date = datetime.utcnow() - timedelta(days=i)
        daily_data = {
            'activities': ['Morning exercise', 'Group activity'] if i % 2 == 0 else ['Reading', 'TV time'],
            'breakfast_eaten': 70 + (i * 3),
            'lunch_eaten': 75 + (i * 2),
            'dinner_eaten': 80 + (i * 2),
            'social_interactions': 3 + (i % 3),
            'notable_events': ['Family visit'] if i == 3 else [],
            'photos': [f'/photos/day_{i}_1.jpg'],
            'staff_notes': 'Good day',
            'activity_participation': i % 3 != 0,
            'sleep_quality': 'good' if i % 2 == 0 else 'fair'
        }
        update = family_service.create_daily_update(resident_id, daily_data)
        week_data.append(update)
    
    # Generate summary
    summary = family_service.generate_weekly_summary(resident_id, week_data)
    
    return WeeklySummaryResponse(
        week_ending=summary['week_ending'],
        predominant_mood=summary['summary']['predominant_mood'],
        mood_breakdown=summary['summary']['mood_breakdown'],
        total_activities=summary['summary']['total_activities'],
        average_meal_consumption=summary['summary']['average_meal_consumption'],
        total_social_interactions=summary['summary']['total_social_interactions'],
        notable_events=summary['summary']['notable_events'],
        health_status=summary['summary']['health_status'],
        highlights=summary['highlights'],
        concerns=summary['concerns'],
        recommendation=summary['summary']['recommendation'],
        photos=summary['photos']
    )

@router.get("/notifications/{family_member_id}")
async def get_family_notifications(
    family_member_id: int,
    unread_only: bool = False,
    limit: int = Query(50, ge=1, le=100)
):
    """
    Get notifications for a family member
    """
    # In production, this would fetch from database
    notifications = []
    
    # Sample notifications
    sample_notifications = [
        FamilyNotification(
            resident_id=1,
            family_member_id=family_member_id,
            type=NotificationType.HEALTH_UPDATE,
            priority=NotificationPriority.MEDIUM,
            title="Daily Health Update",
            message="Your loved one's vitals are stable today. Blood pressure: 120/80, Heart rate: 72",
            created_at=datetime.utcnow() - timedelta(hours=2),
            read=False
        ),
        FamilyNotification(
            resident_id=1,
            family_member_id=family_member_id,
            type=NotificationType.ACTIVITY_UPDATE,
            priority=NotificationPriority.LOW,
            title="Activity Participation",
            message="Participated in morning exercise and art therapy today!",
            image_url="/photos/art_therapy.jpg",
            created_at=datetime.utcnow() - timedelta(hours=4),
            read=True
        ),
        FamilyNotification(
            resident_id=1,
            family_member_id=family_member_id,
            type=NotificationType.MEAL,
            priority=NotificationPriority.LOW,
            title="Lunch Update",
            message="🍽️ Lunch update: 85% eaten. Good appetite today!",
            created_at=datetime.utcnow() - timedelta(hours=6),
            read=True
        ),
        FamilyNotification(
            resident_id=1,
            family_member_id=family_member_id,
            type=NotificationType.VIDEO_CALL,
            priority=NotificationPriority.MEDIUM,
            title="Video Call Reminder",
            message="Video call scheduled for tomorrow at 3:00 PM",
            action_required=True,
            action_type="confirm_call",
            created_at=datetime.utcnow() - timedelta(days=1),
            read=False
        )
    ]
    
    if unread_only:
        notifications = [n for n in sample_notifications if not n.read]
    else:
        notifications = sample_notifications
    
    return [
        NotificationResponse(
            id=i,
            type=n.type.value,
            priority=n.priority.value,
            title=n.title,
            message=n.message,
            timestamp=n.created_at.isoformat(),
            read=n.read,
            data=n.data,
            image_url=n.image_url,
            action_required=n.action_required,
            action_type=n.action_type
        )
        for i, n in enumerate(notifications[:limit])
    ]

@router.post("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: int):
    """
    Mark a notification as read
    """
    # In production, update database
    return {"success": True, "message": "Notification marked as read"}

@router.post("/video-call/schedule")
async def schedule_video_call(schedule: VideoCallSchedule, db: Session = Depends(get_db)):
    """
    Schedule a video call with resident
    """
    resident = db.query(Resident).filter(Resident.id == schedule.resident_id).first()
    if not resident:
        raise HTTPException(status_code=404, detail="Resident not found")
    
    # Create notification
    notification = family_service.schedule_video_call(
        schedule.resident_id,
        schedule.family_member_id,
        schedule.scheduled_time
    )
    
    # In production, this would:
    # 1. Save to database
    # 2. Send calendar invite
    # 3. Notify staff
    # 4. Set up video call link
    
    return {
        "success": True,
        "call_id": f"call_{schedule.resident_id}_{schedule.family_member_id}_{int(schedule.scheduled_time.timestamp())}",
        "call_link": notification.data['call_link'],
        "scheduled_time": schedule.scheduled_time.isoformat(),
        "message": f"Video call scheduled with {resident.name}"
    }

@router.post("/photo/upload")
async def upload_family_photo(
    resident_id: int,
    caption: str = "",
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload a photo to share with resident
    """
    resident = db.query(Resident).filter(Resident.id == resident_id).first()
    if not resident:
        raise HTTPException(status_code=404, detail="Resident not found")
    
    # In production, this would:
    # 1. Validate file type and size
    # 2. Upload to cloud storage
    # 3. Generate thumbnail
    # 4. Save metadata to database
    # 5. Notify staff to show to resident
    
    return {
        "success": True,
        "photo_url": f"/photos/family/{file.filename}",
        "message": f"Photo uploaded for {resident.name}. Staff will share it during next interaction.",
        "caption": caption
    }

@router.post("/message/send")
async def send_message_to_resident(
    resident_id: int,
    message: str,
    sender_name: str,
    db: Session = Depends(get_db)
):
    """
    Send a message to be read to resident
    """
    resident = db.query(Resident).filter(Resident.id == resident_id).first()
    if not resident:
        raise HTTPException(status_code=404, detail="Resident not found")
    
    # In production, this would:
    # 1. Save message to database
    # 2. Notify staff
    # 3. Queue for reading during next interaction
    
    return {
        "success": True,
        "message_id": f"msg_{resident_id}_{int(datetime.utcnow().timestamp())}",
        "delivery_status": "queued",
        "estimated_delivery": "Within 2 hours",
        "message": f"Your message will be read to {resident.name} by staff"
    }

@router.get("/engagement-insights/{resident_id}")
async def get_engagement_insights(
    resident_id: int,
    days: int = Query(30, ge=7, le=90),
    db: Session = Depends(get_db)
):
    """
    Get family engagement insights
    """
    resident = db.query(Resident).filter(Resident.id == resident_id).first()
    if not resident:
        raise HTTPException(status_code=404, detail="Resident not found")
    
    # Analytics on family engagement
    return {
        "period_days": days,
        "resident_name": resident.name,
        "engagement_metrics": {
            "family_visits": 8,
            "video_calls": 12,
            "messages_sent": 24,
            "photos_shared": 15,
            "notifications_read_rate": "92%"
        },
        "impact_on_resident": {
            "mood_improvement": "+18%",
            "activity_participation": "+25%",
            "social_interaction": "+30%",
            "overall_wellbeing": "Positive trend"
        },
        "recommendations": [
            "Schedule weekly video calls for consistent connection",
            "Share photos of family events to maintain involvement",
            "Consider visiting during activity hours for shared experiences"
        ]
    }

@router.get("/care-team/{resident_id}")
async def get_care_team_info(resident_id: int, db: Session = Depends(get_db)):
    """
    Get information about resident's care team
    """
    resident = db.query(Resident).filter(Resident.id == resident_id).first()
    if not resident:
        raise HTTPException(status_code=404, detail="Resident not found")
    
    # In production, this would fetch actual staff assignments
    return {
        "resident_name": resident.name,
        "care_team": [
            {
                "role": "Primary Nurse",
                "name": "Sarah Johnson, RN",
                "shift": "Day shift (7 AM - 3 PM)",
                "contact": "Extension 201"
            },
            {
                "role": "Attending Physician",
                "name": "Dr. Raj Patel",
                "specialty": "Geriatric Medicine",
                "next_visit": "Thursday, 10 AM"
            },
            {
                "role": "Physical Therapist",
                "name": "Mike Chen, PT",
                "schedule": "Monday, Wednesday, Friday",
                "focus": "Fall prevention and mobility"
            },
            {
                "role": "Social Worker",
                "name": "Emily Rodriguez, LCSW",
                "availability": "Weekdays 9 AM - 5 PM",
                "contact": "Extension 305"
            }
        ],
        "care_plan_summary": "Focus on maintaining mobility, social engagement, and medication adherence. "
                           "Physical therapy 3x weekly, group activities daily.",
        "last_updated": datetime.utcnow().isoformat()
    }