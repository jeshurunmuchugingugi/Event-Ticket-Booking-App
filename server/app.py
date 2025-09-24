from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.json.compact = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)
api = Api(app)
CORS(app)

# Models
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    serialize_rules = ('-password', '-tickets.user')
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.Enum('admin', 'customer', name='user_roles'), nullable=False)
    
    tickets = db.relationship('Ticket', backref='user', cascade='all, delete-orphan')

class Event(db.Model, SerializerMixin):
    __tablename__ = 'events'
    
    serialize_rules = ('-tickets.event', '-creator.created_events')
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String(500), nullable=True)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    tickets = db.relationship('Ticket', backref='event', cascade='all, delete-orphan')
    creator = db.relationship('User', backref='created_events')

class Ticket(db.Model, SerializerMixin):
    __tablename__ = 'tickets'
    
    serialize_rules = ('-user.tickets', '-event.tickets')
    
    id = db.Column(db.Integer, primary_key=True)
    price = db.Column(db.Float, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)

# Resources
class Users(Resource):
    def get(self):
        users = User.query.all()
        return [{'id': u.id, 'name': u.name, 'email': u.email, 'role': u.role} for u in users]
    
    def post(self):
        data = request.get_json()
        user = User(name=data['name'], email=data['email'], password=data['password'], role=data['role'])
        db.session.add(user)
        db.session.commit()
        return {'id': user.id, 'name': user.name, 'email': user.email, 'role': user.role}, 201

class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(email=data['email'], password=data['password']).first()
        if user:
            return {'id': user.id, 'name': user.name, 'email': user.email, 'role': user.role}
        return {'error': 'Invalid credentials'}, 401

class Events(Resource):
    def get(self):
        events = Event.query.all()
        return [{'id': e.id, 'title': e.title, 'date': e.date.isoformat(), 'location': e.location, 'description': e.description, 'price': e.price, 'category': e.category, 'image': e.image} for e in events]
    
    def post(self):
        data = request.get_json()
        event = Event(
            title=data['title'],
            date=datetime.fromisoformat(data['date']),
            location=data['location'],
            description=data.get('description'),
            price=data['price'],
            category=data['category'],
            image=data.get('image'),
            created_by=data['created_by']
        )
        db.session.add(event)
        db.session.commit()
        return {'id': event.id, 'title': event.title, 'date': event.date.isoformat(), 'location': event.location, 'description': event.description, 'price': event.price, 'category': event.category, 'image': event.image}, 201

class EventById(Resource):
    def get(self, id):
        event = Event.query.get_or_404(id)
        return {'id': event.id, 'title': event.title, 'date': event.date.isoformat(), 'location': event.location, 'description': event.description, 'price': event.price, 'category': event.category, 'image': event.image}
    
    def patch(self, id):
        event = Event.query.get_or_404(id)
        data = request.get_json()
        
        if 'title' in data:
            event.title = data['title']
        if 'date' in data:
            event.date = datetime.fromisoformat(data['date'])
        if 'location' in data:
            event.location = data['location']
        if 'image' in data:
            event.image = data['image']
        if 'description' in data:
            event.description = data['description']
        if 'price' in data:
            event.price = data['price']
        if 'category' in data:
            event.category = data['category']
            
        db.session.commit()
        return {'id': event.id, 'title': event.title, 'date': event.date.isoformat(), 'location': event.location, 'description': event.description, 'price': event.price, 'category': event.category, 'image': event.image}
    
    def delete(self, id):
        event = Event.query.get_or_404(id)
        db.session.delete(event)
        db.session.commit()
        return '', 204

class Tickets(Resource):
    def get(self):
        tickets = Ticket.query.all()
        return [{'id': t.id, 'price': t.price, 'user_id': t.user_id, 'event_id': t.event_id} for t in tickets]
    
    def post(self):
        data = request.get_json()
        event = Event.query.get(data['event_id'])
        ticket = Ticket(price=event.price, user_id=data['user_id'], event_id=data['event_id'])
        db.session.add(ticket)
        db.session.commit()
        return {'id': ticket.id, 'price': ticket.price, 'user_id': ticket.user_id, 'event_id': ticket.event_id}, 201

class TicketById(Resource):
    def delete(self, id):
        ticket = Ticket.query.get_or_404(id)
        db.session.delete(ticket)
        db.session.commit()
        return '', 204

class UserTickets(Resource):
    def get(self, user_id):
        tickets = Ticket.query.filter_by(user_id=user_id).all()
        result = []
        for ticket in tickets:
            event = Event.query.get(ticket.event_id)
            result.append({
                'id': ticket.id,
                'price': ticket.price,
                'event': {'id': event.id, 'title': event.title, 'date': event.date.isoformat(), 'location': event.location, 'description': event.description, 'image': event.image}
            })
        return result

# Routes
class UserEvents(Resource):
    def get(self, user_id):
        events = Event.query.filter_by(created_by=user_id).all()
        return [{'id': e.id, 'title': e.title, 'date': e.date.isoformat(), 'location': e.location, 'description': e.description, 'price': e.price, 'category': e.category, 'image': e.image} for e in events]

api.add_resource(Users, '/users')
api.add_resource(Login, '/login')
api.add_resource(Events, '/events')
api.add_resource(EventById, '/events/<int:id>')
api.add_resource(Tickets, '/tickets')
api.add_resource(TicketById, '/tickets/<int:id>')
api.add_resource(UserTickets, '/users/<int:user_id>/tickets')
api.add_resource(UserEvents, '/users/<int:user_id>/events')

if __name__ == '__main__':
    app.run(port=5000, debug=True)