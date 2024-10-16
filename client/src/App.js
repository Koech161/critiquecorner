import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import BookManager from './components/BookManager';
import ReviewManager from './components/ReviewManager';
import UserManager from './components/UserManager';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import Register from './components/Register';
import BookDisplay from './components/BookDisplay';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          {/* Use element instead of component */}
          <Route path="/" element={<Homepage />} />
          <Route path="/books" element={<BookDisplay/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/books" element={<BookManager />} />
          <Route path="/admin/reviews" element={<ReviewManager />} />
          <Route path="/admin/users" element={<UserManager />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
