
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import './Login.css';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] =  useState(false)

    const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
      password: Yup.string()
        .min(6, 'Must be at least 6 characters')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      setLoading(true)
      setErrorMessage('')
      try {
        const response = await api.post('/login', values);
         
        localStorage.setItem('token', response.data.token); 
        localStorage.setItem('userId', response.data.user);
        
        login(response.data.token)
        navigate('/')
        
      } catch (error) {
        console.error('Error logging in:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          setErrorMessage(error.response.data.message || 'Invalid email or password. Please try again.');
        } else {
          console.error('Error message:', error.message);
          setErrorMessage('An unexpected error occurred. Please try again later.');
          formik.resetForm()
        }
      }
      finally{
        setLoading(false)
      }
    },
  });

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card" style={{ width: '30rem' }}>
        <div className="card-body">
          <h2 className="card-title text-center">Login</h2>
          {errorMessage && (
            <div className='alert alert-danger' role="alert" aria-live="assertive">
              {errorMessage}
            </div>
          )}
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                className={`form-control ${formik.errors.email ? 'is-invalid' : ''}`}
                placeholder="Email"
                required
              />
              {formik.errors.email && <div className="invalid-feedback">{formik.errors.email}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                className={`form-control ${formik.errors.password ? 'is-invalid' : ''}`}
                placeholder="Password"
                required
              />
              {formik.errors.password && <div className="invalid-feedback">{formik.errors.password}</div>}
            </div>
            <button type="submit" className="btn btn-success w-100">
              {loading ? 'Logging in..': 'Login'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

