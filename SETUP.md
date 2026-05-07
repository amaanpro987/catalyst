# Installation & Setup Guide

## Prerequisites

- Python 3.11+
- Node.js 18+ & npm
- Git
- Docker & Docker Compose (optional)

## Quick Start (Local Development)

### 1. Clone & Navigate

```bash
cd catalyst
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
python -m uvicorn app.main:app --reload
```

Backend will start at `http://localhost:8000`

### 3. Frontend Setup (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will start at `http://localhost:5173`

### 4. Access the Application

- **Web UI**: http://localhost:5173
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Docker Deployment

### Build & Run with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **PostgreSQL**: localhost:5432
- **PgAdmin**: http://localhost:5050

### Access PgAdmin

1. Go to http://localhost:5050
2. Login: admin@catalyst.local / admin
3. Add new server:
   - Host: db
   - Username: catalyst
   - Password: password
   - Database: catalyst

## Environment Configuration

Create `.env` files in backend and frontend:

### Backend `.env`

```env
DATABASE_URL=sqlite:///./catalyst.db
SECRET_KEY=your-secret-key-change-in-production
DEBUG=True
API_TITLE=Catalyst Discovery Platform
API_VERSION=0.1.0
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:8000/api
```

## Project Structure

```
catalyst/
├── backend/
│   ├── app/
│   │   ├── core/              # Configuration, logging, utilities
│   │   ├── layers/            # Knowledge, Generative, Prediction, Visualization, Feedback
│   │   ├── api/               # REST API endpoints
│   │   ├── db/                # Database configuration
│   │   ├── models/            # ORM models
│   │   ├── schemas/           # Pydantic schemas
│   │   └── main.py            # FastAPI app entry point
│   ├── tests/                 # Unit tests
│   ├── requirements.txt       # Python dependencies
│   ├── README.md              # Backend documentation
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API client (api.ts)
│   │   ├── styles/            # Global and component styles
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # React entry point
│   ├── index.html             # HTML template
│   ├── package.json           # Node dependencies
│   ├── vite.config.ts         # Vite configuration
│   ├── tsconfig.json          # TypeScript config
│   ├── README.md              # Frontend documentation
│   └── .gitignore
├── .env                       # Environment variables
├── README.md                  # Main documentation
├── docker-compose.yml         # Docker services
└── SETUP.md                   # This file
```

## Testing

### Backend Tests

```bash
cd backend
pytest tests/ -v
```

### Frontend Tests (Optional)

```bash
cd frontend
npm test
```

## Development Workflow

### API Development

1. **Add new endpoint** in `backend/app/api/`
2. **Update schema** in `backend/app/schemas/schemas.py`
3. **Update service** in `frontend/src/services/api.ts`
4. **Create component** in `frontend/src/components/`
5. **Integrate in App** in `frontend/src/App.tsx`

### Database Migrations

```bash
cd backend

# Create migration
alembic revision --autogenerate -m "Description"

# Apply migration
alembic upgrade head
```

## Common Issues

### Backend won't start

```bash
# Check Python version
python --version  # Should be 3.11+

# Reinstall dependencies
pip install --upgrade -r requirements.txt

# Clear cache
rm -rf __pycache__ .pytest_cache
```

### Frontend connection error

```bash
# Check backend is running
curl http://localhost:8000/health

# Check .env file
cat frontend/.env  # Should have VITE_API_URL=http://localhost:8000/api

# Clear cache
rm -rf node_modules
npm install
npm run dev
```

### Database errors

```bash
# Reset database
rm backend/catalyst.db

# Restart backend (will recreate database)
python -m uvicorn app.main:app --reload
```

## Production Deployment

### Prerequisites

- Python 3.11+ on server
- PostgreSQL 13+
- Nginx/Apache reverse proxy
- SSL certificate
- Process manager (Gunicorn, Supervisor)

### Steps

1. **Backend**:
   ```bash
   pip install gunicorn
   gunicorn app.main:app --workers 4 --bind 0.0.0.0:8000
   ```

2. **Frontend**:
   ```bash
   npm run build
   # Serve dist/ with Nginx
   ```

3. **Nginx Config**:
   ```nginx
   server {
       listen 80;
       server_name catalyst.example.com;
       
       location /api {
           proxy_pass http://localhost:8000;
       }
       
       location / {
           root /path/to/frontend/dist;
           try_files $uri /index.html;
       }
   }
   ```

## Performance Optimization

### Backend

- Enable caching for predictions
- Batch processing for multiple catalysts
- Connection pooling for database
- Monitor API response times

### Frontend

- Code splitting for lazy loading
- Image optimization
- Caching strategies
- Minimize bundle size

## Support & Documentation

- **API Docs**: http://localhost:8000/docs
- **Backend README**: [backend/README.md](backend/README.md)
- **Frontend README**: [frontend/README.md](frontend/README.md)
- **Main README**: [README.md](README.md)

## Next Steps

1. ✅ Run backend: `cd backend && python -m uvicorn app.main:app --reload`
2. ✅ Run frontend: `cd frontend && npm run dev`
3. 📖 Read API documentation at http://localhost:8000/docs
4. 🧪 Try the discovery workflow
5. 🔧 Customize for your use case

## Need Help?

- Check backend logs: `tail -f backend/app.log`
- Check frontend console: Open browser DevTools (F12)
- View API errors: http://localhost:8000/docs
- Test API endpoints: http://localhost:8000/docs (Swagger UI)

Happy discovering! 🧪🚀
