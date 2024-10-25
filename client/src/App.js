import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import Login from './components/Login';
import Register from './components/Register';
import BookDisplay from './components/BookDisplay';
import BookDetails from './components/BookDetails';
import { AuthProvider } from './components/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';



const App = () => {
  return (
    <AuthProvider>

   
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/books" element={<BookDisplay/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/bookdetails/:id' 
          element={
            <ProtectedRoute element={<BookDetails />} />
          } />
          
        </Routes>
        <Footer />
      </div>
    </Router>
    </AuthProvider>
  );
};

export default App;
