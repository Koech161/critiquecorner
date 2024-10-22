import React from 'react';
import './Homepage.css';
import { useNavigate } from 'react-router-dom';



const Homepage = () => {
  const navigate = useNavigate();
  

  const handleExploreButton = () => {
    navigate('/books');
  };

  return (
    <div className="homepage">
      <div className="background-image">
      <div className="homepage-intro">
      <h1>Welcome to the Book Review Website</h1>
      <p>Explore our collection of books and reviews. Join our community to share your thoughts!</p>
      <button className="explore-button" onClick={handleExploreButton}>Explore Books</button>
      </div>
      </div>
    </div>
  );
};

export default Homepage;



// import React from 'react';
// import './Homepage.css';
// import { useNavigate } from 'react-router-dom';



// const Homepage = () => {
//   const navigate = useNavigate();
  

//   const handleExploreButton = () => {
//     navigate('/books');
//   };

//   return (
//     <div style={{marginTop:'200px'}}>
//     <div 
//       className=" homepage container text-center mt-5" 
//     >
//       <h1 className="display-4 text-white bg-secondary"> Welcome to CritiqueCorner the Book Review Website</h1>
//       <p className="lead text-white bg-secondary">Explore our collection of books and reviews. Join our community to share your thoughts!</p>
//       <button 
//         className="btn btn-primary btn-lg mt-4" 
//         onClick={handleExploreButton}
//         aria-label="Explore Books"
//       >
//         Explore Books
//       </button>
//     </div>
//     </div>
//   );
// };

// export default Homepage;
