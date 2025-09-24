# EventHub - Event & Ticket Booking Platform

A full-stack web application for event management and ticket booking built with Flask and React.

## 🚀 Live Demo

**Deployed on Render:** [Your Render URL will be here]

## Features

- **Authentication**: User registration with role selection (admin/customer)
- **Role-based Access**: Admins manage events, customers book tickets
- **Event Management**: Full CRUD operations for events
- **Ticket Booking**: Customers can book and cancel tickets
- **Validation**: Client-side form validation with Formik and Yup
- **Production Ready**: PostgreSQL database, Gunicorn server

## Tech Stack

- **Backend**: Flask, Flask-RESTful, SQLAlchemy, Flask-CORS, PostgreSQL
- **Frontend**: React, React Router DOM, Formik, Yup
- **Database**: SQLite (development), PostgreSQL (production)
- **Deployment**: Render

## Quick Start (Production)

The app is deployed and ready to use:

1. Visit the live demo URL
2. **Sign up** as admin or customer
3. **Admin users** can:
   - Create, edit, and delete events
   - View all events
4. **Customer users** can:
   - Browse events
   - Book tickets at event pricing
   - View and cancel their tickets

## Default Test Account

**Admin Account:**
- Email: admin@example.com
- Password: admin123

## Local Development Setup

### Backend Setup

1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Seed database:
   ```bash
   python seed.py
   ```

5. Run Flask server:
   ```bash
   python app.py
   ```

### Frontend Setup

1. Navigate to client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start React development server:
   ```bash
   npm start
   ```

## Deployment

### Render Deployment

1. **Fork/Clone** this repository
2. **Connect to Render** and link your GitHub repository
3. **Auto-deploy** using the included `render.yaml` configuration
4. **Database** and environment variables are configured automatically

### Manual Deployment

The app includes all necessary files for deployment:
- `Procfile` - Gunicorn configuration
- `build.sh` - Database initialization script
- `render.yaml` - Render service configuration
- `requirements.txt` - Python dependencies

## API Endpoints

- `GET /events` - List all events
- `POST /events` - Create new event (admin only)
- `GET /events/:id` - Get event details
- `PATCH /events/:id` - Update event (admin only)
- `DELETE /events/:id` - Delete event (admin only)
- `POST /users` - User registration
- `POST /login` - User login
- `GET /users/:id/tickets` - Get user's tickets
- `POST /tickets` - Book ticket
- `DELETE /tickets/:id` - Cancel ticket

## Database Models

### User
- id, name, email, role (admin/customer)

### Event
- id, title, date, location, description, price, category, image

### Ticket
- id, price, user_id (FK), event_id (FK)

## Relationships

- User has many Tickets
- Event has many Tickets
- Many-to-many relationship between Users and Events via Tickets

## Environment Variables

### Production (Render)
- `DATABASE_URL` - PostgreSQL connection string (auto-configured)
- `SECRET_KEY` - Flask secret key (auto-generated)
- `PORT` - Server port (auto-configured)

### Development
- Uses SQLite database (`app.db`)
- Default Flask development server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

This project is open source and available under the MIT License.