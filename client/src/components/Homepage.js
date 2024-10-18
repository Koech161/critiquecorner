
import React from 'react';
import './Homepage.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { useUser } from './UserContext';


const Homepage = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser()
  const { isAuthenticated } = useAuth()

  const handleExploreButton = () => {
    navigate('/books');
  };

  return (
    <div 
      className=" homepage container text-center mt-5" 
    >
      <h1 className="display-4 text-white bg-secondary">{isAuthenticated ? `${currentUser.username}`: ''} Welcome to CritiqueCorner the Book Review Website</h1>
      <p className="lead text-white bg-secondary">Explore our collection of books and reviews. Join our community to share your thoughts!</p>
      <button 
        className="btn btn-primary btn-lg mt-4" 
        onClick={handleExploreButton}
        aria-label="Explore Books"
      >
        Explore Books
      </button>
    </div>
  );
};

export default Homepage;
