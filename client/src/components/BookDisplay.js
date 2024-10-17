import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './BookDisplay.css';

const BookDisplay = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await api.get('/books'); 
                console.log(response.data); 
                setBooks(response.data.books); 
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchBooks();
    }, []);

    return (
        <div className='container'>
            <div className='book-list'>
                <h1>Books List</h1></div>
            <div className='book-list-container'>
            <div className='book-list'>
                {Array.isArray(books) && books.length === 0 ? (
                    <p>No books found.</p>
                ) : (
                    books.map((book) => (
                        <div key={book.id} className='book-item'>
                            <div>
                                <img src={book.image_filename} alt={book.title} />
                            </div>
                            <div>
                                <h2>{book.title}</h2>
                            </div>
                        </div>
                    ))
                )}
            </div>
            </div>
        </div> 
    );
};

export default BookDisplay;
