
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import './Login.css';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';

const Login = () => {
<<<<<<<<< Temporary merge branch 1
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
        console.log(response.data); 
        
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
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
        </div>
=========
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, password });
      console.log(response.data); 
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className='container'>
      <div id='centered-container'>
        <h2 className='login'>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            className='input-container'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            className='input-container'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <div className='button-container'>
            <button className='btn btn-success btn-sm custom-button' type="submit">Login</button>
          </div>
        </form>
>>>>>>>>> Temporary merge branch 2
      </div>
    </div>
  );
};

export default Login;
