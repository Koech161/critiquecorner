import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './ReviewManager.css';
const ReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ bookId: '', content: '' });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/reviews');
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prevReview) => ({ ...prevReview, [name]: value }));
  };

  const handleAddReview = async () => {
    try {
      await api.post('/reviews', newReview);
      fetchReviews(); // Refresh the list
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  return (
    <div>
      <h2>Manage Reviews</h2>
      <input
        type="text"
        name="bookId"
        value={newReview.bookId}
        onChange={handleInputChange}
        placeholder="Book ID"
        required
      />
      <textarea
        name="content"
        value={newReview.content}
        onChange={handleInputChange}
        placeholder="Review Content"
        required
      />
      <button onClick={handleAddReview}>Add Review</button>
      <h3>Review List</h3>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>{review.content} (Book ID: {review.bookId})</li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewManager;
