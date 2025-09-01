from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import residents, vitals, alerts, auth, facilities, compliance
from app.models.database import engine, Base
from app.models import compliance_models

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Senior Care AI API",
    description="API for Senior Care Management Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(facilities.router, prefix="/api/facilities", tags=["Facilities"])
app.include_router(residents.router, prefix="/api/residents", tags=["Residents"])
app.include_router(vitals.router, prefix="/api/vitals", tags=["Vitals"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(compliance.router, prefix="/api/compliance", tags=["Compliance"])

@app.get("/")
async def root():
    return {"message": "Senior Care AI API", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}