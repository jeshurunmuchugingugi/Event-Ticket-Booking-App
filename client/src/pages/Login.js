import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required')
});

function Login({ onLogin }) {
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      
      if (response.ok) {
        const userData = await response.json();
        onLogin(userData);
      } else {
        setFieldError('email', 'User not found');
      }
    } catch (error) {
      setFieldError('email', 'Login failed');
    }
    setSubmitting(false);
  };

  return (
    <div className="form-container">
      <h2>Welcome Back</h2>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>
            <button type="submit" disabled={isSubmitting} className="btn">
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Login;