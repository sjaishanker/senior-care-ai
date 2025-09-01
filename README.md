# 🏥 Senior Care AI - Intelligent Healthcare Management Platform

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0+-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🌟 Overview

Senior Care AI is a comprehensive healthcare management platform designed for the booming senior living industry in India and beyond. It combines AI-powered health monitoring, predictive analytics, and enterprise-grade compliance features to revolutionize elderly care.

### 🎯 Key Features

- **Multi-Facility Management** - Manage multiple senior care facilities from a single dashboard
- **Real-Time Health Monitoring** - Track vital signs and generate automated alerts
- **AI-Powered Predictions** - Predict health issues 24-48 hours in advance (Phase 2)
- **HIPAA-Compliant** - Complete audit trails and data protection
- **Family Engagement Portal** - Keep families connected with subscription tiers
- **ROI Analytics** - Track cost savings and efficiency improvements
- **Revenue Generation** - Built-in subscription and marketplace models

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0+ and npm
- **Python** 3.9+
- **Git**
- **VS Code** (recommended) or any code editor

### 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/senior-care-ai.git
cd senior-care-ai
```

2. **Backend Setup**

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from example)
echo "DATABASE_URL=sqlite:///./senior_care.db
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30" > .env

# Generate demo data (creates 50 residents with 30 days of history)
python scripts/generate_demo_data.py

# Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

3. **Frontend Setup** (in a new terminal)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start the development server
npm run dev
```

4. **Access the Application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 🏗️ Project Structure

```
senior-care-ai/
├── backend/
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   │   ├── auth.py     # Authentication
│   │   │   ├── residents.py # Resident management
│   │   │   ├── vitals.py   # Vital signs tracking
│   │   │   ├── alerts.py   # Alert system
│   │   │   ├── facilities.py # Facility management
│   │   │   └── compliance.py # Compliance & audit
│   │   ├── models/         # Database models
│   │   │   ├── database.py # Database connection
│   │   │   ├── models.py   # Core models
│   │   │   └── compliance_models.py # Compliance models
│   │   ├── services/       # Business logic
│   │   │   └── audit_service.py # Audit trail service
│   │   └── main.py         # FastAPI application
│   ├── scripts/
│   │   └── generate_demo_data.py # Demo data generator
│   ├── requirements.txt    # Python dependencies
│   └── senior_care.db      # SQLite database (auto-generated)
│
├── frontend/
│   ├── pages/              # Next.js pages
│   │   ├── index.tsx       # Main dashboard
│   │   ├── resident/
│   │   │   └── [id].tsx    # Resident profile
│   │   ├── roi-dashboard.tsx # ROI analytics
│   │   └── family-portal.tsx # Family portal
│   ├── components/         # React components (if any)
│   ├── styles/            # CSS styles
│   │   └── globals.css    # Global styles
│   ├── public/            # Static assets
│   ├── package.json       # Node dependencies
│   ├── next.config.js     # Next.js configuration
│   └── tsconfig.json      # TypeScript config
│
├── docs/                   # Documentation
├── PHASE_1_IMPLEMENTATION.md # Detailed Phase 1 documentation
├── PHASE_2_ROADMAP.md     # AI Integration roadmap
├── PHASE_3_ROADMAP.md     # Marketplace roadmap
├── PHASE_4_ROADMAP.md     # Global expansion roadmap
└── README.md              # This file
```

## 🔧 Configuration

### Backend Configuration (.env)

Create a `.env` file in the `backend` directory:

```env
# Database
DATABASE_URL=sqlite:///./senior_care.db  # For production, use PostgreSQL

# Security
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Optional: OpenAI API for AI features (Phase 2)
OPENAI_API_KEY=your-openai-api-key
```

### Frontend Configuration (.env.local)

Create a `.env.local` file in the `frontend` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## 📊 Database Schema

The application uses 14 tables across core and compliance modules:

### Core Tables (5)
- `facilities` - Multi-facility management
- `residents` - Resident profiles  
- `vitals` - Health metrics
- `alerts` - Alert system
- `users` - User management

### Compliance Tables (9)
- `audit_logs` - HIPAA-compliant audit trail
- `incident_reports` - Incident management
- `family_subscriptions` - Revenue model
- `roi_metrics` - ROI tracking
- `compliance_reports` - Regulatory compliance
- `care_documents` - Document management
- `medication_administrations` - MAR system
- `family_communications` - Family engagement
- `quality_measures` - CMS metrics

## 🧪 Demo Data & Testing

### Generate Demo Data
```bash
cd backend
python scripts/generate_demo_data.py
```

This creates:
- 3 Facilities (Bangalore locations)
- 50 Residents with Indian names
- 30 days of vital signs history
- Weekly alert patterns
- Test user accounts

### Test Accounts

| Email | Password | Role | Access |
|-------|----------|------|--------|
| admin@seniorcare.com | admin123 | Admin | All facilities |
| admin1@seniorcare.com | admin123 | Admin | Sunshine facility |
| family1@example.com | family123 | Family | Limited access |

## 📚 API Documentation

### Authentication
```bash
# Login
curl -X POST "http://localhost:8000/api/auth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@seniorcare.com&password=admin123"

# Returns: {"access_token": "...", "token_type": "bearer"}
```

### Example API Calls
```bash
# Get facilities
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8000/api/facilities/"

# Get residents for a facility
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8000/api/residents/?facility_id=1"

# Get ROI metrics
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8000/api/compliance/roi-summary?facility_id=1"
```

Full API documentation available at: http://localhost:8000/docs

## 🔐 Security Features

- **JWT Authentication** with 30-minute token expiry
- **Role-Based Access Control** (Admin, Staff, Family, Doctor)
- **HIPAA Compliance** with complete audit trails
- **Risk Scoring Algorithm** (0-100) for suspicious activities
- **IP Tracking** and session management
- **Data Anonymization** for exports

## 🚢 Production Deployment

### Using Docker

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/seniorcare
    depends_on:
      - db
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=seniorcare
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Run with:
```bash
docker-compose up --build
```

### Manual Deployment

1. **Backend with Gunicorn**
```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

2. **Frontend Production Build**
```bash
npm run build
npm start
```

3. **PostgreSQL Migration**
```bash
# Update DATABASE_URL in .env
DATABASE_URL=postgresql://user:password@localhost/senior_care_db
```

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9  # macOS/Linux
# or
netstat -ano | findstr :8000    # Windows (then kill the PID)
```

**Module not found errors**
```bash
# Reinstall dependencies
cd backend
pip install -r requirements.txt --upgrade

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

**Database issues**
```bash
# Reset database
cd backend
rm senior_care.db
python scripts/generate_demo_data.py
```

## 📈 Features by Phase

### ✅ Phase 1 (Current - COMPLETE)
- Multi-facility dashboard
- Resident management (50 residents)
- Vital signs tracking (30 days history)
- Alert system (4 severity levels)
- HIPAA-compliant audit trails
- Family portal with subscriptions
- ROI analytics dashboard
- 14 database tables
- 40+ API endpoints

### 🚧 Phase 2 (Weeks 3-4)
- AI health predictions
- Real-time WebSocket
- Native mobile apps
- IoT device integration
- EHR integration

### 🔮 Phase 3 (Weeks 5-6)
- Healthcare marketplace
- Home care services
- Payment gateway
- Education platform
- B2B solutions

### 🌍 Phase 4 (Months 2-6)
- International expansion
- Advanced robotics
- Precision medicine
- $1B valuation target

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Jaishanker** - Data Engineer & AI Specialist

## 🙏 Acknowledgments

- FastAPI for the excellent backend framework
- Next.js team for the frontend framework
- The open-source community

## 📞 Support

- **Documentation**: See [PHASE_1_IMPLEMENTATION.md](PHASE_1_IMPLEMENTATION.md) for detailed docs
- **Issues**: [GitHub Issues](https://github.com/yourusername/senior-care-ai/issues)

## 🚀 Performance Metrics

- **API Response**: <100ms average
- **Frontend Load**: <2s initial load
- **Concurrent Users**: 100+ supported
- **Data Volume**: 1000+ residents capable

---

<div align="center">

**Built with ❤️ for the senior care community**

[Documentation](PHASE_1_IMPLEMENTATION.md) • [Roadmap](PHASE_2_ROADMAP.md) • [Report Bug](https://github.com/yourusername/senior-care-ai/issues)

</div>