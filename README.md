# EventHub - Event & Ticket Booking Platform

A full-stack web application for event management and ticket booking built with Flask and React.

## Features

- **Authentication**: User registration with role selection (admin/customer)
- **Role-based Access**: Admins manage events, customers book tickets
- **Event Management**: Full CRUD operations for events
- **Ticket Booking**: Customers can book and cancel tickets
- **Validation**: Client-side form validation with Formik and Yup

## Tech Stack

- **Backend**: Flask, Flask-RESTful, SQLAlchemy, Flask-CORS
- **Frontend**: React, React Router DOM, Formik, Yup
- **Database**: SQLite

## Setup Instructions

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

## Usage

1. Visit `http://localhost:3000`
2. Sign up as admin or customer
3. **Admin users** can:
   - Create, edit, and delete events
   - View all events
4. **Customer users** can:
   - Browse events
   - Book tickets at event pricing
   - View and cancel their tickets

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