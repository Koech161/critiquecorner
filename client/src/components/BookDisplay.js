import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import api from '../services/api'; 

const BookDisplay = () => {
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();
    const { token } = useAuth();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await api.get('/books'); 
                console.log(response.data); 
                setBooks(response.data); 
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchBooks();
    }, [token]);

    const handleNavigation = (id) => {
        navigate(`/bookdetails/${id}`);
    };

    return (
        <div className='container' style={{ marginTop: '100px' }}>
            <h1 className='text-center my-4'>Books List</h1>
            <div className='row'>
                {Array.isArray(books) && books.length === 0 ? (
                    <p>No books found.</p>
                ) : (
                    books.map((book) => (
                        <div 
                            key={book.id} 
                            className='col-md-3 mb-4' 
                            onClick={() => handleNavigation(book.id)}
                        >
                            <div className='card' style={{ cursor: 'pointer' }}>
                                <img 
                                    src={book.image_filename} 
                                    alt={book.title} 
                                    className='card-img-top' 
                                    style={{ height: '300px', objectFit: 'cover' }} 
                                />
                                <div className='card-body'>
                                    <h5 className='card-title text-center'>{book.title}</h5>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BookDisplay;
