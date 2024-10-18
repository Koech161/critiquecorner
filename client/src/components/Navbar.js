import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; 
import { useAuth } from './AuthProvider';

const Navbar = () => {
  const { isAuthenticated, logout} = useAuth()
  const navigate = useNavigate()
  const adminEndPoint = process.env.ADMIN_ENDPOINT || 'http://127.0.0.1:5555/admin';

  const handleLogout = () =>{
    logout()
    navigate('/')

 }
  
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">CritiqueCorner</Link>
        <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarNav' aria-controls='navbarNav' aria-expanded='false' aria-label='Toggle navigation'>
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>

                </li>
                <li className="nav-item">
              <a className="nav-link" href={adminEndPoint} target="_blank" rel="noopener noreferrer">Admin Panel</a>
            </li>
                
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
            
            
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
