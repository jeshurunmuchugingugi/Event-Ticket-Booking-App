#!/usr/bin/env bash
# Build script for Render deployment

set -o errexit  # exit on error

pip install -r requirements.txt

# Run database migrations/setup
python -c "
from app import app, db, User
with app.app_context():
    db.create_all()
    # Create default admin if no users exist
    if User.query.count() == 0:
        admin = User(name='Admin User', email='admin@example.com', password='admin123', role='admin')
        db.session.add(admin)
        db.session.commit()
        print('Default admin user created')
    else:
        print('Database already initialized')
"