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
    <div className='container'>
      <div id='centered-container'>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input 
            className='input-container'
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
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
            <button className='btn btn-info btn-lg w-100' type="submit">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
