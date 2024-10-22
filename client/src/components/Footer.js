import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" style={{ borderTop: '1px solid #ccc', marginTop: '20px' }}>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>About Us</h5>
            <p>
              CritiqueCorner is your go-to platform for honest book reviews, recommendations, and discussions. We believe in the power of literature to inspire and transform lives.
            </p>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className='list-unstyled'>
              <li><a href="/">Home</a></li>
              <li><a href="/">About Us</a></li>
              <li><a href="/books">Books</a></li>
              <li><a href="/books">Authors</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Connect with Us</h5>
            <p>Follow us on social media for the latest updates:</p>
            <ul className="list-unstyled">
              <li><a href="/">Facebook</a></li>
              <li><a href="/">Instagram</a></li>
              <li><a href="/" >LinkedIn</a></li>
              <li><a href="/" >X</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center">
        <p>&copy; {new Date().getFullYear()} CritiqueCorner. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;

