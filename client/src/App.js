import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="container">
          <Routes>
            <Route path="/auth" element={!user ? <Auth onLogin={handleLogin} /> : <Navigate to="/events" />} />
            <Route path="/events" element={user ? <Events user={user} /> : <Navigate to="/auth" />} />
            <Route path="/events/:id" element={user ? <EventDetail user={user} /> : <Navigate to="/auth" />} />
            <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/auth" />} />
            <Route path="/" element={<Navigate to="/events" />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;