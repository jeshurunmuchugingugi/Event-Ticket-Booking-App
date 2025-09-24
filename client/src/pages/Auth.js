import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required')
});

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
  role: Yup.string().oneOf(['admin', 'customer']).required('Required')
});

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleLogin = async (values, { setSubmitting, setFieldError }) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      
      if (response.ok) {
        const userData = await response.json();
        onLogin(userData);
        navigate('/events');
      } else {
        const errorData = await response.json();
        setFieldError('password', errorData.error || 'Login failed');
      }
    } catch (error) {
      setFieldError('email', 'Login failed');
    }
    setSubmitting(false);
  };

  const handleSignup = async (values, { setSubmitting, setFieldError }) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      
      if (response.ok) {
        const userData = await response.json();
        onLogin(userData);
        navigate('/events');
      } else {
        const errorData = await response.json();
        setFieldError('email', errorData.error || 'Signup failed');
      }
    } catch (error) {
      setFieldError('email', 'Signup failed');
    }
    setSubmitting(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-welcome">
        <h1>Welcome to EventHub</h1>
        <p>Your premier destination for discovering and booking amazing events</p>
        <div className="auth-features">
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <span>Discover Events</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎫</span>
            <span>Easy Booking</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <span>Instant Access</span>
          </div>
        </div>
      </div>
      <div className="auth-card">
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {isLogin ? (
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting }) => (
              <Form className="auth-form">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Field type="email" name="email" />
                  <ErrorMessage name="email" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Field type="password" name="password" />
                  <ErrorMessage name="password" component="div" className="error" />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn auth-btn">
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={{ name: '', email: '', password: '', role: '' }}
            validationSchema={SignupSchema}
            onSubmit={handleSignup}
          >
            {({ isSubmitting }) => (
              <Form className="auth-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <Field type="text" name="name" />
                  <ErrorMessage name="name" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Field type="email" name="email" />
                  <ErrorMessage name="email" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Field type="password" name="password" />
                  <ErrorMessage name="password" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <Field as="select" name="role">
                    <option value="">Select Role</option>
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </Field>
                  <ErrorMessage name="role" component="div" className="error" />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn auth-btn">
                  {isSubmitting ? 'Creating account...' : 'Create Account'}
                </button>
              </Form>
            )}
          </Formik>
        )}
        <div className="auth-footer">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}

export default Auth;