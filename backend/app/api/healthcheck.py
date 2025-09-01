from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.services.healthcheck import health_service

router = APIRouter()

@router.get("/health", response_model=Dict[str, Any])
async def basic_health_check():
    """Basic health check endpoint"""
    return {
        "status": "healthy",
        "service": "Senior Care AI API",
        "version": "1.0.0",
        "message": "Service is running"
    }

@router.get("/health/detailed", response_model=Dict[str, Any])
async def detailed_health_check():
    """Comprehensive health check with system metrics"""
    try:
        health_data = health_service.comprehensive_health_check()
        return health_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")

@router.get("/health/database", response_model=Dict[str, Any])
async def database_health_check():
    """Check database connectivity and stats"""
    try:
        db_status = health_service.get_database_status()
        return db_status
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database health check failed: {str(e)}")

@router.get("/health/system", response_model=Dict[str, Any])
async def system_health_check():
    """Check system resources (CPU, Memory, Disk)"""
    try:
        system_status = health_service.get_system_resources()
        return system_status
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"System health check failed: {str(e)}")

@router.get("/health/uptime", response_model=Dict[str, Any])
async def uptime_check():
    """Get application uptime information"""
    try:
        uptime_info = health_service.get_uptime()
        return uptime_info
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Uptime check failed: {str(e)}")

@router.get("/health/logs")
async def get_health_logs():
    """Get recent health check logs"""
    try:
        import os
        log_file = "logs/healthcheck.log"
        
        if not os.path.exists(log_file):
            return {"message": "No health logs found yet"}
        
        # Read last 50 lines of the log file
        with open(log_file, 'r') as f:
            lines = f.readlines()
            recent_logs = lines[-50:] if len(lines) > 50 else lines
        
        return {
            "log_file": log_file,
            "total_lines": len(lines),
            "recent_entries": len(recent_logs),
            "logs": [line.strip() for line in recent_logs]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read health logs: {str(e)}")