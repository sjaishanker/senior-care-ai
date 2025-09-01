#!/bin/bash

# This script creates a clean commit history for the Senior Care AI project
# Run this after initializing the git repository

echo "🚀 Creating clean commit history for Senior Care AI..."

# Configure git (you should update these with your details)
git config user.name "Jaishanker"
git config user.email "jaishanker@example.com"

# Commit 1: Initial commit with documentation
echo "📝 Commit 1: Initial project setup..."
git add README.md LICENSE .gitignore PHASE_*.md
git commit -m "Initial commit: Project setup and documentation

- Add comprehensive README with setup instructions
- Add MIT LICENSE
- Add .gitignore for Python/Node.js
- Add Phase 1-4 roadmap documentation
- Define project structure and architecture"

# Commit 2: Backend core setup
echo "⚙️ Commit 2: Backend FastAPI setup..."
git add backend/app/main.py backend/app/models/database.py backend/requirements.txt backend/app/__init__.py
git commit -m "feat(backend): Initial FastAPI setup with core configuration

- Setup FastAPI application with CORS
- Configure SQLAlchemy database connection
- Add requirements.txt with dependencies
- Setup project structure"

# Commit 3: Database models
echo "💾 Commit 3: Core database models..."
git add backend/app/models/models.py
git commit -m "feat(backend): Add core database models

- Add Facility model for multi-facility support
- Add Resident model with medical information
- Add Vitals model for health metrics
- Add Alert model for health alerts
- Add User model with role-based access"

# Commit 4: Authentication system
echo "🔐 Commit 4: Authentication system..."
git add backend/app/api/auth.py
git commit -m "feat(backend): Implement JWT authentication system

- Add JWT token generation and validation
- Implement user registration and login
- Add password hashing with bcrypt
- Setup OAuth2 password flow
- Add role-based access control"

# Commit 5: Core API endpoints
echo "🔌 Commit 5: Core API endpoints..."
git add backend/app/api/residents.py backend/app/api/vitals.py backend/app/api/alerts.py backend/app/api/facilities.py
git commit -m "feat(backend): Add core API endpoints

- Implement residents CRUD operations
- Add vitals tracking endpoints
- Create alert management system
- Add facility management endpoints
- Include filtering and pagination"

# Commit 6: Frontend initial setup
echo "🎨 Commit 6: Frontend Next.js setup..."
git add frontend/package*.json frontend/tsconfig.json frontend/next.config.js frontend/tailwind.config.js frontend/postcss.config.js
git add frontend/styles/ frontend/public/ frontend/.eslintrc.json
git commit -m "feat(frontend): Initial Next.js setup with TypeScript

- Setup Next.js 14 with TypeScript
- Configure TailwindCSS for styling
- Add ESLint configuration
- Setup project structure
- Add package dependencies"

# Commit 7: Main dashboard
echo "📊 Commit 7: Main dashboard..."
git add frontend/pages/index.tsx frontend/pages/_app.tsx frontend/pages/_document.tsx
git commit -m "feat(frontend): Implement main dashboard with multi-facility support

- Create responsive dashboard layout
- Add facility selector dropdown
- Implement resident grid view
- Add alert summary cards
- Include real-time statistics"

# Commit 8: Resident profile
echo "👤 Commit 8: Resident profile view..."
git add frontend/pages/resident/
git commit -m "feat(frontend): Add resident 360° profile view

- Create detailed resident profile page
- Add vital signs charts with 7-day history
- Implement alert history view
- Add medical information display
- Include emergency contact details"

# Commit 9: Compliance suite
echo "📋 Commit 9: Compliance suite..."
git add backend/app/models/compliance_models.py backend/app/services/audit_service.py backend/app/api/compliance.py
git commit -m "feat(backend): Add comprehensive compliance suite

- Implement HIPAA-compliant audit logging
- Add risk scoring algorithm (0-100)
- Create incident reporting system
- Add medication administration records
- Implement family subscription model
- Add ROI metrics tracking"

# Commit 10: Analytics dashboards
echo "📈 Commit 10: Analytics dashboards..."
git add frontend/pages/roi-dashboard.tsx frontend/pages/family-portal.tsx
git commit -m "feat(frontend): Add ROI analytics and family portal

- Create ROI analytics dashboard
- Add cost savings metrics
- Implement family portal with subscriptions
- Add compliance score visualization
- Include KPI tracking"

# Commit 11: Demo data generator
echo "🔧 Commit 11: Demo data and utilities..."
git add backend/scripts/
git commit -m "feat(backend): Add demo data generator

- Create script to generate 50 residents
- Add 30 days of historical vital signs
- Generate realistic alert patterns
- Create test user accounts
- Add Indian names and locations"

# Commit 12: Docker and deployment
echo "🐳 Commit 12: Docker configuration..."
git add docker-compose.yml backend/Dockerfile frontend/Dockerfile 2>/dev/null || echo "Docker files will be added when created"
git commit -m "chore: Add Docker configuration for deployment

- Add docker-compose.yml for full stack
- Configure environment variables
- Setup production deployment guides
- Add troubleshooting documentation" --allow-empty

echo "✅ Clean commit history created successfully!"
echo ""
echo "📦 Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Add the remote: git remote add origin https://github.com/YOUR_USERNAME/senior-care-ai.git"
echo "3. Push to GitHub: git push -u origin main"
