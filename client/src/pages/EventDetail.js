import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';



function EventDetail({ user }) {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await fetch(`/events/${id}`);
      const data = await response.json();
      setEvent(data);
    };
    fetchEvent();
  }, [id]);

  const handleBookTicket = async () => {
    try {
      const response = await fetch('/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          event_id: parseInt(id)
        })
      });
      
      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        // Trigger navbar update by dispatching custom event
        window.dispatchEvent(new Event('ticketBooked'));
      }
    } catch (error) {
      console.error('Error booking ticket:', error);
    }
  };

  if (!event) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading event details...</p>
    </div>
  );

  return (
    <div className="event-detail-page">
      <div className="event-hero">
        {event.image && (
          <div className="hero-image-container">
            <img 
              src={event.image} 
              alt={event.title}
              className="hero-image"
            />
            <div className="hero-overlay">
              <div className="hero-content">
                <h1 className="event-title">{event.title}</h1>
                <div className="event-meta">
                  <span className="meta-item">
                    <span className="meta-icon">📅</span>
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="meta-item">
                    <span className="meta-icon">📍</span>
                    {event.location}
                  </span>
                  <span className="meta-item">
                    <span className="meta-icon">🕒</span>
                    {new Date(event.date).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="event-content">
        <div className="content-grid">
          <div className="main-content">
            <div className="description-card">
              <h2>About This Event</h2>
              {event.description ? (
                <p className="event-description">{event.description}</p>
              ) : (
                <p className="no-description">No description available for this event.</p>
              )}
            </div>
            
            <div className="details-card">
              <h3>Event Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">📅 Date & Time</span>
                  <span className="detail-value">{new Date(event.date).toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📍 Location</span>
                  <span className="detail-value">{event.location}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">🎫 Event Type</span>
                  <span className="detail-value">General Admission</span>
                </div>
              </div>
            </div>
          </div>

          {user.role === 'customer' && (
            <div className="booking-sidebar">
              <div className="booking-card">
                <h3>🎫 Book Your Ticket</h3>
                <p className="booking-subtitle">Secure your spot at this amazing event</p>
                <div className="price-display">
                  <span className="price-label">Ticket Price</span>
                  <span className="price-amount">${event.price}</span>
                </div>
                <button 
                  onClick={() => handleBookTicket({}, { setSubmitting: () => {} })} 
                  className="book-btn"
                >
                  🎫 Book Ticket Now
                </button>
                <p className="booking-note">💡 Price set by event organizer</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {showSuccess && (
        <div className="success-popup">
          <div className="success-content">
            <span className="success-icon">✅</span>
            <h3>Ticket Booked Successfully!</h3>
            <p>Your ticket has been confirmed. Check your profile for details.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDetail;