# Render Deployment Guide

## Backend Deployment (Web Service)

1. **Create Web Service on Render**
   - Connect GitHub repository
   - Root Directory: `server`
   - Build Command: `./build.sh`
   - Start Command: `gunicorn app:app`

2. **Environment Variables (Auto-configured)**
   - `DATABASE_URL` - PostgreSQL connection (auto-generated)
   - `SECRET_KEY` - Flask secret (auto-generated)
   - `PORT` - Server port (auto-configured)

## DATABASE_URL Configuration

On Render, the environment variable `DATABASE_URL` tells your Flask backend how to connect to the database. Its value depends on which database you're using:

### PostgreSQL (Recommended for Production)
```
DATABASE_URL=postgresql://username:password@hostname:port/database_name
```
Example:
```
DATABASE_URL=postgresql://user:pass123@dpg-abc123-a.oregon-postgres.render.com:5432/myapp_db
```

### SQLite (Development Only)
```
DATABASE_URL=sqlite:///app.db
```

### MySQL (Alternative)
```
DATABASE_URL=mysql://username:password@hostname:port/database_name
```

**Note:** Render automatically generates the PostgreSQL `DATABASE_URL` when you create a PostgreSQL service. Your Flask app detects this and switches from SQLite (development) to PostgreSQL (production) automatically.

3. **Test Backend**
   - Visit: `https://your-backend.onrender.com/health`
   - Should return: `{"status": "healthy"}`
   - Test API: `https://your-backend.onrender.com/api/events`

## Frontend Deployment (Static Site)

1. **Create Static Site on Render**
   - Connect same GitHub repository
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`

2. **Environment Variables**
   - `REACT_APP_API_URL` = `https://your-backend.onrender.com`
   - (Replace with your actual backend URL)

3. **Build Process**
   ```bash
   cd client
   npm install
   npm run build
   ```

## Troubleshooting 502 Errors

### Backend Issues:
- Check Render logs for backend service
- Verify `/health` endpoint works
- Ensure PostgreSQL database is connected
- Verify `DATABASE_URL` environment variable is set
- Check database connection in logs

### Frontend Issues:
- Verify `REACT_APP_API_URL` is set correctly
- Rebuild after setting environment variables
- Check browser console for CORS errors

### CORS Issues:
- Backend already has `CORS(app)` configured
- All API routes use `/api/` prefix

## Default Admin Account
- Email: admin@example.com
- Password: admin123

## API Endpoints
All endpoints use `/api/` prefix:
- `GET /api/events` - List events
- `POST /api/users` - Register user
- `POST /api/login` - User login
- `POST /api/tickets` - Book ticket