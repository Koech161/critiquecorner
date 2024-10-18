import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useUser } from './UserContext';

const BookDetails = () => {
    const { id } = useParams();
    const [bookInfo, setBookInfo] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [editingReview, setEditingReview] = useState(null);
    const { currentUser} = useUser()
    

    useEffect(() => {
        const fetchBookInfo = async () => {
            try {
                const response = await axios.get(`/books/${id}`);
                setBookInfo(response.data);
            } catch (error) {
                console.error('Error fetching book details:', error);
                setError('Failed to fetch book details.');
            }
        };

        fetchBookInfo();
    }, [id]);

    const handleReviewSubmit = async (values, { resetForm }) => {
        if (!currentUser) {
            setError('You must be logged in to submit a review.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            if (editingReview) {
               
                await axios.patch(`/reviews/${id}`, {
                    content: values.content,
                    rating: values.rating,
                    user_id: currentUser.id, 
                    book_id: id
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccessMessage('Review updated successfully!');
            } else {
               
                await axios.post('/reviews', {
                    content: values.content,
                    rating: values.rating,
                    user_id: currentUser.id, 
                    book_id: id
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccessMessage('Review added successfully!');
            }
            resetForm();
            setEditingReview(null); 
        } catch (error) {
            console.error('Error handling review:', error);
            setError('Failed to save review.');
        }
    };

    const handleEditReview = (review) => {
        setEditingReview(review);
    };
    
    const handleDeleteReview = async (id) =>{
        try {
            const response = await axios.delete(`reviews/${id}`)
                setSuccessMessage('Review deleted successfully')
                setBookInfo((prevBookInfo) =>({
                    ...prevBookInfo,
                    reviews: bookInfo.review.filter(rev => rev.id !=id)
                }))
            
        } catch (error) {
            console.error('error deleteing review',error);
            setError('error deleting review')
            
        }
    }

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={i <= rating ? 'text-warning' : 'text-muted'}>
                    ★
                </span>
            );
        }
        return <div>{stars}</div>;
    };

    if (!bookInfo) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-danger">{error}</div>;
    }

    const reviews = Array.isArray(bookInfo.review) ? bookInfo.review : [];
    // const ralatedBooks = Array.isArray(bookInfo.author.id) ? bookInfo.author.name : []

    return (
        <div className="container mt-5" style={{marginTop: '80px'}}>
            <div className="card mb-4">
                <div className="row g-0">
                    <div className="col-md-4">
                        <img 
                            src={bookInfo.image_url} 
                            alt={bookInfo.title} 
                            className="img-fluid rounded-start" 
                            style={{ height: '100%', objectFit: 'cover' }} 
                        />
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <h1 className="card-title">{bookInfo.title}</h1>
                            <p className="card-text"><strong>Author:</strong> {bookInfo.author.name}</p>
                            <p className="card-text"><strong>Published at:</strong> {new Date(bookInfo['published at']).toLocaleDateString()}</p>
                            <h2 className="mt-4">Reviews</h2>
                            <ul className="list-group mb-4">
                                {reviews.length > 0 ? (
                                    reviews.map((review, index) => (
                                        <li key={index} className="list-group-item">
                                        
                                            <strong>Rating: </strong>
                                            <em>by {review.username}</em>
                                            {renderStars(review.rating)}
                                            <p>{review.content}</p>
                                            <button 
                                                className="btn btn-link" 
                                                onClick={() => handleEditReview(review)}
                                            >
                                               <span role="img" aria-label="edit">
                                                        ✏️
                                                 </span>
                                            </button>
                                            <button className='btn btn-link' onClick={() => handleDeleteReview(review.id)}>
                                            <span role="img" aria-label="delete">
                                                🗑
                                            </span>
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <li className="list-group-item">No reviews available</li>
                                )}
                            </ul>

                            <Formik
                                initialValues={{
                                    content: editingReview ? editingReview.content : '',
                                    rating: editingReview ? editingReview.rating : ''
                                }}
                                validationSchema={Yup.object({
                                    content: Yup.string().required('Required'),
                                    rating: Yup.number().required('Required').min(1).max(5)
                                })}
                                onSubmit={handleReviewSubmit}
                            >
                                <Form>
                                    <div className="form-group">
                                        <label htmlFor="content">Review</label>
                                        <Field name="content" as="textarea" className="form-control" />
                                        <ErrorMessage name="content" component="div" className="text-danger" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="rating">Rating (1-5)</label>
                                        <Field name="rating" as="select" className="form-control">
                                            <option value="">Select a rating</option>
                                            {[1, 2, 3, 4, 5].map((value) => (
                                                <option key={value} value={value}>{value}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="rating" component="div" className="text-danger" />
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        {editingReview ? 'Update Review' : 'Add Review'}
                                    </button>
                                </Form>
                            </Formik>

                            {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;

