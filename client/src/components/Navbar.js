import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file


const Navbar = () => {
  
  return (
    <nav className="navbar">
      <h1 className="navbar-title">CritiqueCorner</h1>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li>
            <a href="http://127.0.0.1:5555/admin" target="_blank" rel="noopener noreferrer">Admin Panel</a>
          </li>
     
      </ul>
    </nav>
  );
};

export default Navbar;
