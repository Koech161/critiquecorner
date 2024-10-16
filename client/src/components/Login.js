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
    <div class='container'>
      <div id='centered-container' class='container'>
      <div class='container'>
      <h2 class='login'>Login</h2>
      <form onSubmit={handleLogin}>
        <input class='input-container'
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input  class='input-container'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button class='btn btn-success btn-sm' type="submit">Login</button>
      </form>
    </div>
      </div>
    </div>
  );
};

export default Login;
