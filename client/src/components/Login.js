
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import './Login.css';

const Login = () => {
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
      try {
        const response = await api.post('/login', values);
        // console.log(response.data); 
        
        
        localStorage.setItem('token', response.data.token); 
        localStorage.setItem('userId', response.data.user);
        
      } catch (error) {
        console.error('Error logging in:', error);
      
      }
    },
  });

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card" style={{ width: '30rem' }}>
        <div className="card-body">
          <h2 className="card-title text-center">Login</h2>
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
            <button type="submit" className="btn btn-success w-100">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

