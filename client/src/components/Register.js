import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import './Register.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate()
  const [emailCheck, setEmailCheck] = useState('')
  const [loading, setLoading] =useState(false)
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      setEmailCheck('')
      setLoading(true)
      try {
        const emailCheckResponse = await api.post('/check_email', {email: values.email});
        if (emailCheckResponse.data.exists) {
          setEmailCheck('Email is already registered.');
          setLoading(false)
          return;
        }
        const response = await api.post('/users', values);
        console.log(response.data);
        navigate('/login')
      } catch (error) {
        console.error('Error registering:', error);
        setEmailCheck('Email already registered.');
      
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
          <h2 className="card-title text-center">Register</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                name="username"
                onChange={formik.handleChange}
                value={formik.values.username}
                className={`form-control ${formik.errors.username ? 'is-invalid' : ''}`}
                placeholder="Username"
                required
              />
              {formik.errors.username && <div className="invalid-feedback">{formik.errors.username}</div>}
            </div>
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
            {emailCheck && <div className="alert alert-danger">{emailCheck}</div>}
            <button type="submit" className="btn btn-primary w-100">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
