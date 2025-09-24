import React, { useState, useEffect } from 'react';

function Profile({ user }) {
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchUserTickets();
    if (user.role === 'admin') {
      fetchUserEvents();
    }
  }, [user.id, user.role]);

  const fetchUserTickets = async () => {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const response = await fetch(`${API_URL}/api/users/${user.id}/tickets`);
    const data = await response.json();
    setTickets(data);
  };

  const fetchUserEvents = async () => {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const response = await fetch(`${API_URL}/api/users/${user.id}/events`);
    const data = await response.json();
    setEvents(data);
  };

  const handleCancelTicket = async (ticketId) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/tickets/${ticketId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchUserTickets();
      }
    } catch (error) {
      console.error('Error canceling ticket:', error);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="profile-intro">
          <h1>Welcome back, {user.name}!</h1>
          <p className="profile-subtitle">{user.role === 'admin' ? 'Event Manager' : 'Event Explorer'}</p>
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-number">{user.role === 'admin' ? events.length : tickets.length}</span>
              <span className="stat-label">{user.role === 'admin' ? 'Events Created' : 'Tickets Booked'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{user.role === 'admin' ? 'Pro' : 'Active'}</span>
              <span className="stat-label">Status</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="profile-details">
        <div className="detail-card">
          <h3>📧 Email</h3>
          <p>{user.email}</p>
        </div>
        <div className="detail-card">
          <h3>👤 Role</h3>
          <p>{user.role}</p>
        </div>
        <div className="detail-card">
          <h3>📅 Member Since</h3>
          <p>January 2024</p>
        </div>
      </div>

      {user.role === 'admin' ? (
        <div className="content-section">
          <div className="section-header">
            <h2>🎯 My Created Events</h2>
            <span className="section-count">{events.length} events</span>
          </div>
          {events.length === 0 ? (
            <div className="empty-state-modern">
              <div className="empty-icon">🎯</div>
              <h3>No events created yet!</h3>
              <p>Start creating events to build your portfolio and manage attendees.</p>
            </div>
          ) : (
            <div className="content-grid">
              {events.map(event => (
                <div key={event.id} className="content-card">
                  <div className="card-header">
                    <h3>{event.title}</h3>
                    <span className="status-badge">Active</span>
                  </div>
                  <div className="card-body">
                    <p><span className="icon">📅</span> {new Date(event.date).toLocaleDateString()}</p>
                    <p><span className="icon">📍</span> {event.location}</p>
                    {event.description && <p className="description">{event.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="content-section">
          <div className="section-header">
            <h2>🎫 My Tickets</h2>
            <span className="section-count">{tickets.length} tickets</span>
          </div>
          {tickets.length === 0 ? (
            <div className="empty-state-modern">
              <div className="empty-icon">🎫</div>
              <h3>No tickets yet!</h3>
              <p>Start exploring events and book your first ticket to see them here.</p>
            </div>
          ) : (
            <div className="content-grid">
              {tickets.map(ticket => (
                <div key={ticket.id} className="content-card">
                  <div className="card-header">
                    <h3>{ticket.event.title}</h3>
                    <span className="price-badge">${ticket.price}</span>
                  </div>
                  <div className="card-body">
                    <p><span className="icon">📅</span> {new Date(ticket.event.date).toLocaleDateString()}</p>
                    <p><span className="icon">📍</span> {ticket.event.location}</p>
                  </div>
                  <div className="card-actions">
                    <button 
                      onClick={() => handleCancelTicket(ticket.id)} 
                      className="btn btn-danger"
                    >
                      Cancel Ticket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;