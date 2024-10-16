import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import './BookManager.css';

const BookManager = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '' });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prevBook) => ({ ...prevBook, [name]: value }));
  };

  const handleAddBook = async () => {
    try {
      await axios.post('/books', newBook);
      fetchBooks(); // Refresh the list
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await axios.delete(`/books/${id}`);
      fetchBooks(); // Refresh the list
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div>
      <h2>Manage Books</h2>
      <div>
        <input
          type="text"
          name="title"
          value={newBook.title}
          onChange={handleInputChange}
          placeholder="Book Title"
        />
        <input
          type="text"
          name="author"
          value={newBook.author}
          onChange={handleInputChange}
          placeholder="Author"
        />
        <button onClick={handleAddBook}>Add Book</button>
      </div>

      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} by {book.author}
            <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookManager;
