import React, { useState } from 'react';
import api from '../services/api';
import './Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/register', { username, email, password });
      console.log(response.data); 
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div  class= 'container'>
    <div id='centered-container' class = 'container'>
      <div class='container'>
      <h2 >Register</h2>
      <form onSubmit={handleRegister}>
        <input class='input-container'
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input class='input-container'
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input class='input-container'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button class='btn btn-success btn-sm' type="submit">Register</button>
      </form>
      </div>
    </div>
    </div>
  );
};

export default Register;
