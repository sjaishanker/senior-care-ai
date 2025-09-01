from sqlalchemy.orm import Session
from app.models.compliance_models import AuditLog, AuditLogType
from app.models.models import User
from datetime import datetime
from typing import Optional, Dict, Any
import json
import hashlib
import ipaddress

class AuditService:
    def __init__(self, db: Session):
        self.db = db
    
    def log_action(
        self,
        user_id: int,
        facility_id: int,
        action_type: AuditLogType,
        resource_type: Optional[str] = None,
        resource_id: Optional[int] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        session_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
        before_data: Optional[Dict[str, Any]] = None,
        after_data: Optional[Dict[str, Any]] = None
    ) -> AuditLog:
        """
        Log a user action for compliance and audit purposes
        """
        risk_score = self._calculate_risk_score(action_type, user_id, ip_address, details)
        
        audit_log = AuditLog(
            facility_id=facility_id,
            user_id=user_id,
            action_type=action_type,
            resource_type=resource_type,
            resource_id=resource_id,
            timestamp=datetime.utcnow(),
            ip_address=ip_address,
            user_agent=user_agent,
            session_id=session_id,
            details=details,
            before_data=before_data,
            after_data=after_data,
            risk_score=risk_score,
            requires_review=risk_score > 70
        )
        
        self.db.add(audit_log)
        self.db.commit()
        
        return audit_log
    
    def _calculate_risk_score(
        self,
        action_type: AuditLogType,
        user_id: int,
        ip_address: Optional[str],
        details: Optional[Dict[str, Any]]
    ) -> int:
        """
        Calculate risk score for the action (0-100)
        Higher scores indicate higher risk activities
        """
        risk_score = 0
        
        # Base risk scores by action type
        action_risk_scores = {
            AuditLogType.LOGIN: 10,
            AuditLogType.LOGOUT: 5,
            AuditLogType.VIEW_RESIDENT: 20,
            AuditLogType.EDIT_RESIDENT: 60,
            AuditLogType.VIEW_VITALS: 15,
            AuditLogType.ADD_VITALS: 30,
            AuditLogType.VIEW_ALERTS: 25,
            AuditLogType.RESOLVE_ALERT: 40,
            AuditLogType.VIEW_MEDICATION: 35,
            AuditLogType.ADMINISTER_MEDICATION: 80,
            AuditLogType.INCIDENT_REPORT: 70,
            AuditLogType.EMERGENCY_CALL: 90,
            AuditLogType.FAMILY_COMMUNICATION: 30,
            AuditLogType.DOCUMENT_ACCESS: 50,
            AuditLogType.SYSTEM_EXPORT: 85,
            AuditLogType.SETTINGS_CHANGE: 75
        }
        
        risk_score = action_risk_scores.get(action_type, 30)
        
        # Check for suspicious IP patterns
        if ip_address:
            if self._is_suspicious_ip(ip_address):
                risk_score += 30
            if self._is_foreign_ip(ip_address):
                risk_score += 20
        
        # Check for after-hours access
        current_hour = datetime.utcnow().hour
        if current_hour < 6 or current_hour > 22:  # Outside 6 AM - 10 PM
            risk_score += 15
        
        # Check for bulk operations
        if details and details.get('bulk_operation', False):
            risk_score += 25
        
        return min(risk_score, 100)  # Cap at 100
    
    def _is_suspicious_ip(self, ip_address: str) -> bool:
        """Check if IP address is from known suspicious ranges"""
        try:
            ip = ipaddress.ip_address(ip_address)
            # Add logic for known malicious IP ranges
            # This would typically integrate with threat intelligence feeds
            return False
        except:
            return True  # Invalid IP format is suspicious
    
    def _is_foreign_ip(self, ip_address: str) -> bool:
        """Check if IP address is from outside India (simplified)"""
        # In production, this would use a GeoIP database
        # For demo, we'll just check for private/local IPs
        try:
            ip = ipaddress.ip_address(ip_address)
            return not ip.is_private and not ip.is_loopback
        except:
            return False
    
    def get_user_activity_summary(self, user_id: int, days: int = 30) -> Dict[str, Any]:
        """Get activity summary for a user"""
        from datetime import timedelta
        start_date = datetime.utcnow() - timedelta(days=days)
        
        logs = self.db.query(AuditLog).filter(
            AuditLog.user_id == user_id,
            AuditLog.timestamp >= start_date
        ).all()
        
        activity_counts = {}
        high_risk_actions = 0
        unique_ips = set()
        
        for log in logs:
            action = log.action_type.value
            activity_counts[action] = activity_counts.get(action, 0) + 1
            
            if log.risk_score > 70:
                high_risk_actions += 1
            
            if log.ip_address:
                unique_ips.add(log.ip_address)
        
        return {
            'total_actions': len(logs),
            'activity_breakdown': activity_counts,
            'high_risk_actions': high_risk_actions,
            'unique_ip_addresses': len(unique_ips),
            'average_risk_score': sum(log.risk_score for log in logs) / len(logs) if logs else 0
        }
    
    def get_facility_compliance_summary(self, facility_id: int, days: int = 30) -> Dict[str, Any]:
        """Get compliance summary for a facility"""
        from datetime import timedelta
        start_date = datetime.utcnow() - timedelta(days=days)
        
        logs = self.db.query(AuditLog).filter(
            AuditLog.facility_id == facility_id,
            AuditLog.timestamp >= start_date
        ).all()
        
        total_logs = len(logs)
        high_risk_logs = sum(1 for log in logs if log.risk_score > 70)
        unreviewed_high_risk = sum(1 for log in logs if log.risk_score > 70 and not log.reviewed_at)
        
        # Calculate HIPAA compliance indicators
        hipaa_violations = 0
        unauthorized_access = 0
        
        for log in logs:
            if log.action_type in [AuditLogType.SYSTEM_EXPORT, AuditLogType.DOCUMENT_ACCESS]:
                if log.risk_score > 80:
                    hipaa_violations += 1
            
            if log.risk_score > 90:
                unauthorized_access += 1
        
        return {
            'total_audit_entries': total_logs,
            'high_risk_actions': high_risk_logs,
            'unreviewed_high_risk': unreviewed_high_risk,
            'potential_hipaa_violations': hipaa_violations,
            'unauthorized_access_attempts': unauthorized_access,
            'compliance_score': max(0, 100 - (hipaa_violations * 10) - (unauthorized_access * 20))
        }

# Middleware for automatic audit logging
class AuditMiddleware:
    def __init__(self, db: Session):
        self.audit_service = AuditService(db)
    
    def log_api_access(
        self,
        user_id: int,
        facility_id: int,
        endpoint: str,
        method: str,
        ip_address: str,
        user_agent: str,
        session_id: str,
        response_status: int
    ):
        """Log API access for audit trail"""
        action_type = self._map_endpoint_to_action_type(endpoint, method)
        
        if action_type:
            details = {
                'endpoint': endpoint,
                'method': method,
                'response_status': response_status,
                'api_access': True
            }
            
            self.audit_service.log_action(
                user_id=user_id,
                facility_id=facility_id,
                action_type=action_type,
                ip_address=ip_address,
                user_agent=user_agent,
                session_id=session_id,
                details=details
            )
    
    def _map_endpoint_to_action_type(self, endpoint: str, method: str) -> Optional[AuditLogType]:
        """Map API endpoints to audit log action types"""
        endpoint_mappings = {
            ('GET', '/api/residents/'): AuditLogType.VIEW_RESIDENT,
            ('GET', '/api/residents/{id}'): AuditLogType.VIEW_RESIDENT,
            ('PUT', '/api/residents/{id}'): AuditLogType.EDIT_RESIDENT,
            ('GET', '/api/vitals/'): AuditLogType.VIEW_VITALS,
            ('POST', '/api/vitals/'): AuditLogType.ADD_VITALS,
            ('GET', '/api/alerts/'): AuditLogType.VIEW_ALERTS,
            ('PUT', '/api/alerts/{id}/resolve'): AuditLogType.RESOLVE_ALERT,
            ('POST', '/api/auth/token'): AuditLogType.LOGIN,
        }
        
        # Normalize endpoint for pattern matching
        normalized_endpoint = endpoint
        if '/residents/' in endpoint and endpoint.split('/')[-1].isdigit():
            normalized_endpoint = '/api/residents/{id}'
        elif '/alerts/' in endpoint and 'resolve' in endpoint:
            normalized_endpoint = '/api/alerts/{id}/resolve'
        
        return endpoint_mappings.get((method, normalized_endpoint))

# HIPAA Compliance Checker
class HIPAAComplianceChecker:
    @staticmethod
    def check_data_access_authorization(user: User, resource_type: str, resource_id: int) -> bool:
        """Check if user is authorized to access specific data"""
        # Implement role-based access control
        if user.role.value == 'admin':
            return True
        
        # Family members can only access their resident's data
        if user.role.value == 'family':
            # This would check if the resident is associated with this family member
            return True  # Simplified for demo
        
        # Staff can access residents in their facility
        if user.role.value == 'staff':
            return True  # Simplified for demo
        
        return False
    
    @staticmethod
    def anonymize_data_for_reporting(data: Dict[str, Any]) -> Dict[str, Any]:
        """Remove or hash PII for reporting purposes"""
        anonymized = data.copy()
        
        # Fields to anonymize
        pii_fields = ['name', 'emergency_contact', 'emergency_contact_name', 'email']
        
        for field in pii_fields:
            if field in anonymized:
                # Hash the value for consistency while removing PII
                anonymized[field] = hashlib.sha256(str(anonymized[field]).encode()).hexdigest()[:8]
        
        return anonymized