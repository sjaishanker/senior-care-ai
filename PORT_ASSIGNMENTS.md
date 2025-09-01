# Port Assignments - Senior Care AI Platform

## Fixed Port Configuration

All services in the Senior Care AI platform run on specific, fixed ports to ensure consistency and avoid conflicts.

### Service Ports

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| **Frontend Dashboard** | 3000 | http://localhost:3000 | Main facility management dashboard |
| **Marketing Website** | 3001 | http://localhost:3001 | Public-facing marketing website |
| **Backend API** | 8000 | http://localhost:8000 | FastAPI backend service with healthcheck |

### Starting Services

#### Backend API (Port 8000)
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend Dashboard (Port 3000)
```bash
cd frontend
npm run dev
```

#### Marketing Website (Port 3001)
```bash
cd website
npm run dev
```

### Port Configuration Files

- **Frontend**: Port configured in `frontend/package.json` scripts
- **Website**: Port configured in `website/package.json` scripts
- **Backend**: Port specified in uvicorn command (default 8000)

### Notes

- Ports are now hardcoded in the package.json files to ensure consistency
- Backend always runs on port 8000 (FastAPI default)
- Frontend dashboard always runs on port 3000
- Marketing website always runs on port 3001
- All services can run simultaneously without port conflicts

### Troubleshooting

If you encounter port conflicts:

1. Check if another process is using the port:
   ```bash
   lsof -i :3000  # Check port 3000
   lsof -i :3001  # Check port 3001
   lsof -i :8000  # Check port 8000
   ```

2. Kill any conflicting processes:
   ```bash
   kill -9 <PID>
   ```

3. Restart the services using the commands above