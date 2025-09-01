import logging
import os
import time
import psutil
import asyncio
from datetime import datetime
from typing import Dict, Any
from sqlalchemy import text
from app.models.database import engine, SessionLocal

# Configure logging for healthcheck
logging.basicConfig(level=logging.INFO)
healthcheck_logger = logging.getLogger("healthcheck")

# Create logs directory if it doesn't exist
os.makedirs("logs", exist_ok=True)

# File handler for healthcheck logs
file_handler = logging.FileHandler("logs/healthcheck.log")
file_handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
healthcheck_logger.addHandler(file_handler)

class HealthCheckService:
    def __init__(self):
        self.start_time = time.time()
    
    def get_database_status(self) -> Dict[str, Any]:
        """Check database connectivity and basic stats"""
        try:
            db = SessionLocal()
            start_time = time.time()
            
            # Test basic connectivity
            result = db.execute(text("SELECT 1")).fetchone()
            
            # Get some basic stats
            facilities_result = db.execute(text("SELECT COUNT(*) FROM facilities")).fetchone()
            residents_result = db.execute(text("SELECT COUNT(*) FROM residents")).fetchone()
            
            db.close()
            
            response_time = round((time.time() - start_time) * 1000, 2)
            
            return {
                "status": "healthy",
                "response_time_ms": response_time,
                "facilities_count": facilities_result[0] if facilities_result else 0,
                "residents_count": residents_result[0] if residents_result else 0,
                "last_checked": datetime.utcnow().isoformat()
            }
        except Exception as e:
            healthcheck_logger.error(f"Database health check failed: {str(e)}")
            return {
                "status": "unhealthy",
                "error": str(e),
                "last_checked": datetime.utcnow().isoformat()
            }
    
    def get_system_resources(self) -> Dict[str, Any]:
        """Get system resource usage"""
        try:
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            return {
                "cpu_usage_percent": cpu_percent,
                "memory": {
                    "total_gb": round(memory.total / (1024**3), 2),
                    "used_gb": round(memory.used / (1024**3), 2),
                    "available_gb": round(memory.available / (1024**3), 2),
                    "usage_percent": memory.percent
                },
                "disk": {
                    "total_gb": round(disk.total / (1024**3), 2),
                    "used_gb": round(disk.used / (1024**3), 2),
                    "free_gb": round(disk.free / (1024**3), 2),
                    "usage_percent": round((disk.used / disk.total) * 100, 2)
                }
            }
        except Exception as e:
            healthcheck_logger.error(f"System resource check failed: {str(e)}")
            return {
                "status": "error",
                "error": str(e)
            }
    
    def get_uptime(self) -> Dict[str, Any]:
        """Get application uptime"""
        uptime_seconds = time.time() - self.start_time
        uptime_hours = uptime_seconds / 3600
        uptime_days = uptime_hours / 24
        
        return {
            "uptime_seconds": round(uptime_seconds, 2),
            "uptime_hours": round(uptime_hours, 2),
            "uptime_days": round(uptime_days, 2),
            "started_at": datetime.fromtimestamp(self.start_time).isoformat()
        }
    
    def comprehensive_health_check(self) -> Dict[str, Any]:
        """Perform comprehensive health check"""
        start_time = time.time()
        
        # Get all health metrics
        database_status = self.get_database_status()
        system_resources = self.get_system_resources()
        uptime_info = self.get_uptime()
        
        # Determine overall health
        overall_status = "healthy"
        if database_status.get("status") != "healthy":
            overall_status = "unhealthy"
        elif system_resources.get("memory", {}).get("usage_percent", 0) > 90:
            overall_status = "warning"
        elif system_resources.get("disk", {}).get("usage_percent", 0) > 90:
            overall_status = "warning"
        
        health_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "overall_status": overall_status,
            "service": "Senior Care AI API",
            "version": "1.0.0",
            "database": database_status,
            "system_resources": system_resources,
            "uptime": uptime_info,
            "response_time_ms": round((time.time() - start_time) * 1000, 2)
        }
        
        # Log the health check
        healthcheck_logger.info(f"Health check completed - Status: {overall_status} | "
                               f"DB: {database_status.get('status')} | "
                               f"CPU: {system_resources.get('cpu_usage_percent', 'N/A')}% | "
                               f"Memory: {system_resources.get('memory', {}).get('usage_percent', 'N/A')}%")
        
        return health_data

# Global instance
health_service = HealthCheckService()

async def periodic_health_check():
    """Run health check every minute"""
    while True:
        try:
            health_service.comprehensive_health_check()
            await asyncio.sleep(60)  # Wait 1 minute
        except Exception as e:
            healthcheck_logger.error(f"Periodic health check failed: {str(e)}")
            await asyncio.sleep(60)  # Still wait before retry