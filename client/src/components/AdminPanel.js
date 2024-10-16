import React from 'react';
import { Link } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = () => {
  return (
    <div class='container'>
      <div class="contianer">
      <h1>Admin Panel</h1>
      <ul>
        <li><Link to="/admin/books">Manage Books</Link></li>
        <li><Link to="/admin/reviews">Manage Reviews</Link></li>
        <li><Link to="/admin/users">Manage Users</Link></li>
      </ul>
    </div>
        </div>
  );
};

export default AdminPanel;
