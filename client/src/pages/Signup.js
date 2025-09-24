import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  role: Yup.string().oneOf(['admin', 'customer']).required('Required')
});

function Signup({ onLogin }) {
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await fetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      
      if (response.ok) {
        const userData = await response.json();
        onLogin(userData);
      } else {
        setFieldError('email', 'Signup failed');
      }
    } catch (error) {
      setFieldError('email', 'Signup failed');
    }
    setSubmitting(false);
  };

  return (
    <div className="form-container">
      <h2>Join Us Today</h2>
      <Formik
        initialValues={{ name: '', email: '', role: 'customer' }}
        validationSchema={SignupSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
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
              <label htmlFor="role">Role</label>
              <Field as="select" name="role">
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </Field>
              <ErrorMessage name="role" component="div" className="error" />
            </div>
            <button type="submit" disabled={isSubmitting} className="btn">
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Signup;