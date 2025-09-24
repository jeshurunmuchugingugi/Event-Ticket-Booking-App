from app import app, db, User, Event, Ticket
from datetime import datetime

with app.app_context():
    db.create_all()
    
    # Check if users already exist
    if User.query.count() == 0:
        # Create users
        admin = User(name="Admin User", email="admin@example.com", password="admin123", role="admin")
        customer1 = User(name="John Doe", email="john@example.com", password="john123", role="customer")
        customer2 = User(name="Jane Smith", email="jane@example.com", password="jane123", role="customer")
        
        db.session.add_all([admin, customer1, customer2])
        db.session.commit()
    
    # Get admin user for events
    admin = User.query.filter_by(email="admin@example.com").first()
    
    # Create events if none exist
    if Event.query.count() == 0:
        event1 = Event(title="Tech Conference 2024", date=datetime(2024, 6, 15, 9, 0), location="San Francisco", description="Join industry leaders for cutting-edge technology discussions and networking.", price=299.99, category="Corporate / Business", image="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400", created_by=admin.id)
        event2 = Event(title="Music Festival", date=datetime(2024, 7, 20, 18, 0), location="Los Angeles", description="Experience amazing live performances from top artists in a vibrant atmosphere.", price=149.50, category="Arts & Entertainment", image="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400", created_by=admin.id)
        event3 = Event(title="Art Exhibition", date=datetime(2024, 5, 10, 10, 0), location="New York", description="Discover contemporary artworks from emerging and established artists.", price=75.00, category="Arts & Entertainment", image="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", created_by=admin.id)
        
        db.session.add_all([event1, event2, event3])
        db.session.commit()
    
    # Create tickets if none exist
    if Ticket.query.count() == 0:
        customer1 = User.query.filter_by(email="john@example.com").first()
        customer2 = User.query.filter_by(email="jane@example.com").first()
        event1 = Event.query.first()
        event2 = Event.query.offset(1).first()
        
        ticket1 = Ticket(price=299.99, user_id=customer1.id, event_id=event1.id)
        ticket2 = Ticket(price=150.00, user_id=customer2.id, event_id=event2.id)
        
        db.session.add_all([ticket1, ticket2])
        db.session.commit()
    
    print("Database seeded successfully!")
    print(f"Created {User.query.count()} users")
    print(f"Created {Event.query.count()} events")
    print(f"Created {Ticket.query.count()} tickets")