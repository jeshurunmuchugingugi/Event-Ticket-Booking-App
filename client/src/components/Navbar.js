import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const [ticketCount, setTicketCount] = useState(0);

  useEffect(() => {
    if (user && user.role === 'customer') {
      fetchTicketCount();
      // Listen for ticket booking events
      const handleTicketBooked = () => fetchTicketCount();
      window.addEventListener('ticketBooked', handleTicketBooked);
      return () => window.removeEventListener('ticketBooked', handleTicketBooked);
    }
  }, [user]);

  const fetchTicketCount = async () => {
    try {
      const response = await fetch(`/users/${user.id}/tickets`);
      const tickets = await response.json();
      setTicketCount(tickets.length);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/events">Events</Link>
          {user && <Link to="/profile">Profile</Link>}
        </li>
        <li>
          {user ? (
            <div className="user-info">
              {user.role === 'customer' && (
                <div className="ticket-counter">
                  <span className="ticket-icon">🎫</span>
                  <span className="ticket-count">{ticketCount}</span>
                </div>
              )}
              <span className="welcome-text">
                {user.name} ({user.role})
              </span>
              <button onClick={onLogout} className="btn">Logout</button>
            </div>
          ) : (
            <div>
              <Link to="/auth">Sign In</Link>
              <Link to="/auth" className="btn">Sign Up</Link>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;