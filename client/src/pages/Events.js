import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EventSchema = Yup.object().shape({
  title: Yup.string().required('Required'),
  date: Yup.date().required('Required'),
  location: Yup.string().required('Required')
});

function Events({ user }) {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = events;
    
    if (searchTerm !== '') {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedCategory !== '') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }
    
    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedCategory]);

  const fetchEvents = async () => {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const response = await fetch(`${API_URL}/api/events`);
    const data = await response.json();
    setEvents(data);
    setFilteredEvents(data);
  };

  const handleCreateEvent = async (values, { setSubmitting, resetForm }) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, created_by: user.id })
      });
      
      if (response.ok) {
        fetchEvents();
        resetForm();
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
    setSubmitting(false);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/events/${eventId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchEvents();
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleUpdateEvent = async (values, { setSubmitting, resetForm }) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/events/${editingEvent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      
      if (response.ok) {
        fetchEvents();
        resetForm();
        setShowForm(false);
        setEditingEvent(null);
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
    setSubmitting(false);
  };

  return (
    <div className="events-page">
      <div className="hero-section-short">
        <h1>Discover Amazing Events</h1>
        <p>Find and get tickets for the best events in your area</p>
      </div>
      
      <div className="events-header">
        <h2>All Events</h2>
        <div className="header-controls">
          {user.role === 'customer' && (
            <div className="filter-controls">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <button className="search-btn" onClick={() => {}}>
                  🔍
                </button>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-filter"
              >
                <option value="">All Categories</option>
                <option value="Corporate / Business">Corporate / Business</option>
                <option value="Social / Private">Social / Private</option>
                <option value="Arts & Entertainment">Arts & Entertainment</option>
                <option value="Sports & Fitness">Sports & Fitness</option>
                <option value="Educational / Academic">Educational / Academic</option>
                <option value="Fundraising / Charity">Fundraising / Charity</option>
                <option value="Religious / Spiritual">Religious / Spiritual</option>
                <option value="Virtual / Hybrid">Virtual / Hybrid</option>
                <option value="Promotional / Marketing">Promotional / Marketing</option>
                <option value="Community / Local">Community / Local</option>
              </select>
            </div>
          )}
          {user.role === 'admin' && (
            <button onClick={() => setShowForm(!showForm)} className="btn create-btn">
              {showForm ? 'Cancel' : 'Create Event'}
            </button>
          )}
        </div>
      </div>

      {showForm && user.role === 'admin' && (
        <div className="form-container">
          <h3>{editingEvent ? 'Edit Event' : 'Create New Event'}</h3>
          <Formik
            initialValues={editingEvent ? {
              title: editingEvent.title,
              date: editingEvent.date.slice(0, 16),
              location: editingEvent.location,
              description: editingEvent.description || '',
              price: editingEvent.price,
              category: editingEvent.category,
              image: editingEvent.image || ''
            } : { title: '', date: '', location: '', description: '', price: '', category: '', image: '' }}
            validationSchema={EventSchema}
            onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <Field type="text" name="title" />
                  <ErrorMessage name="title" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <Field type="datetime-local" name="date" />
                  <ErrorMessage name="date" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <Field type="text" name="location" />
                  <ErrorMessage name="location" component="div" className="error" />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="description">Description</label>
                  <Field as="textarea" name="description" rows="2" placeholder="Event description..." />
                  <ErrorMessage name="description" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="price">Price ($)</label>
                  <Field type="number" step="0.01" name="price" placeholder="0.00" />
                  <ErrorMessage name="price" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <Field as="select" name="category">
                    <option value="">Select Category</option>
                    <option value="Corporate / Business">Corporate / Business</option>
                    <option value="Social / Private">Social / Private</option>
                    <option value="Arts & Entertainment">Arts & Entertainment</option>
                    <option value="Sports & Fitness">Sports & Fitness</option>
                    <option value="Educational / Academic">Educational / Academic</option>
                    <option value="Fundraising / Charity">Fundraising / Charity</option>
                    <option value="Religious / Spiritual">Religious / Spiritual</option>
                    <option value="Virtual / Hybrid">Virtual / Hybrid</option>
                    <option value="Promotional / Marketing">Promotional / Marketing</option>
                    <option value="Community / Local">Community / Local</option>
                  </Field>
                  <ErrorMessage name="category" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="image">Image URL</label>
                  <Field type="url" name="image" placeholder="https://example.com/image.jpg" />
                  <ErrorMessage name="image" component="div" className="error" />
                </div>
                <div className="form-group full-width">
                  <button type="submit" disabled={isSubmitting} className="btn">
                    {isSubmitting ? (editingEvent ? 'Updating...' : 'Creating...') : (editingEvent ? 'Update Event' : 'Create Event')}
                  </button>
                  {editingEvent && (
                    <button type="button" onClick={() => { setEditingEvent(null); setShowForm(false); }} className="btn" style={{marginLeft: '10px', background: '#6b7280'}}>
                      Cancel
                    </button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}

      
      <div className="events-container">
        {filteredEvents.map(event => (
          <div key={event.id} className="event-item">
            {event.image && (
              <img 
                src={event.image} 
                alt={event.title}
                className="event-image"
              />
            )}
            <div className="event-details">
              <h3 className="event-title">{event.title}</h3>
              <p className="event-date">{new Date(event.date).toLocaleDateString()}</p>
              <p className="event-location">{event.location}</p>
              <div className="event-category">{event.category}</div>
              {event.description && (
                <p className="event-description">{event.description}</p>
              )}
              <div className="event-price">${event.price}</div>
            </div>
            <div className="event-actions">
              <Link to={`/events/${event.id}`} className="btn view-btn">
                View
              </Link>
              {user.role === 'admin' && (
                <>
                  <div className="admin-badge">Admin</div>
                  <button 
                    onClick={() => handleEditEvent(event)} 
                    className="btn edit-btn"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteEvent(event.id)} 
                    className="btn delete-btn"
                  >
                    🗑️ Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {filteredEvents.length === 0 && searchTerm && (
          <div className="no-results">
            <p>No events found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;