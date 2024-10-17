import React, { useState } from 'react';
import api from '../services/api';
import './Login.css';

const Login = () => {
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
      </div>
    </div>
  );
};

export default Login;
