import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import Login from './components/Login';
import Register from './components/Register';
import BookDisplay from './components/BookDisplay';
import BookDetails from './components/BookDetails';



const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/books" element={<BookDisplay/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/bookdetails/:id' element={<BookDetails />} />
          {/* <Route path="/admin/books" element={<BookManager />} />
          <Route path="/admin/reviews" element={<ReviewManager />} />
          <Route path="/admin/users" element={<UserManager />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
