// import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useUser } from './UserContext';
import { useAuth } from './AuthProvider';
import api from '../services/api';
import { Spinner } from 'react-bootstrap';

const BookDetails = () => {
    const { id } = useParams();
    const [bookInfo, setBookInfo] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [editingReview, setEditingReview] = useState(null);
    const navigate = useNavigate()
    const { currentUser} = useUser()
    const { token } = useAuth()
    

    useEffect(() => {
        const fetchBookInfo = async () => {
            setLoading(true)
            try {
                const response = await api.get(`/books/${id}`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setBookInfo(response.data);
            } catch (error) {
                console.error('Error fetching book details:', error);
                setError('Failed to fetch book details.');
            }
            finally{
                setLoading(false)
            }
        };

        fetchBookInfo();
    }, [id, token]);
    if (loading) {
        return (
            <div className="text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }
    const handleReviewSubmit = async (values, { resetForm }) => {
        if (!currentUser) {
            setError('You must be logged in to submit a review.');
            return;
        }
        try {
            const reviewData = {
                content: values.content,
                rating: values.rating,
                user_id: currentUser.id,
                book_id: id,
            };
            if (editingReview) {
                await api.patch(`/reviews/${editingReview.id}`, reviewData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccessMessage('Review updated successfully!');
            } else {
                await api.post('/reviews', reviewData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccessMessage('Review added successfully!');
            }
            resetForm();
            setEditingReview(null); 
        } catch (error) {
            console.error('Error handling review:', error);
            setError('Failed to save review: ' + error.response?.data?.message || 'Unknown error.');
        }
    };

    // const handleReviewSubmit = async (values, { resetForm }) => {
    //     if (!currentUser) {
    //         setError('You must be logged in to submit a review.');
    //         return;
    //     }
    //     try {
    //         // const token = localStorage.getItem('token');
    //         if (editingReview) {
    //             // API call to update the review
    //             await api.patch(`/reviews/${id}`, {
    //                 content: values.content,
    //                 rating: values.rating,
    //                 user_id: currentUser.id,
    //                 book_id: id
    //             }, {
    //                 headers: { Authorization: `Bearer ${token}` }
    //             });
    
    //             setSuccessMessage('Review updated successfully!');
    //         } else {
               
    //             await api.post('/reviews', {
    //                 content: values.content,
    //                 rating: values.rating,
    //                 user_id: currentUser.id, 
    //                 book_id: id
    //             }, {
    //                 headers: { Authorization: `Bearer ${token}` }
    //             });
    //             setSuccessMessage('Review added successfully!');
    //         }
    //         resetForm();
    //         setEditingReview(null); 
    //     } catch (error) {
    //         console.error('Error handling review:', error);
    //         setError('Failed to save review.');
    //     }
    // };

    // const handleEditReview = (review) => {
    //     setEditingReview(review);
    // };
    
    // const handleDeleteReview = async (reviewId) => {
    //     const reviewToDelete = bookInfo.review.find(rev => rev.id === reviewId);
    //     const updatedReviews = bookInfo.review.filter(rev => rev.id !== reviewId);

    //     setBookInfo(prevBookInfo => ({
    //         ...prevBookInfo,
    //         review: updatedReviews,
    //     }));

    //     try {
    //         await api.delete(`/reviews/${reviewId}`, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         setSuccessMessage({ success: 'Review deleted successfully!' });
    //     } catch (error) {
    //         console.error('Error deleting review:', error);
    //         setError({ error: 'Failed to delete review. Please try again.' });
    //         setBookInfo(prevBookInfo => ({
    //             ...prevBookInfo,
    //             review: [...prevBookInfo.review, reviewToDelete],
    //         }));
    //     }
    // };

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
        return <div className="text-center">No book information available</div>;
    }

    if (error) {
        return <div className="text-center text-danger">{error}</div>;
    }
    const handleNavigate =() => {
        navigate('/books')
    }
    const handleNavigation = (id) => {
        navigate(`/bookdetails/${id}`);
    };

    const reviews = Array.isArray(bookInfo.review) ? bookInfo.review : [];
    const related_books = Array.isArray(bookInfo.related_books) ? bookInfo.related_books : []
   

    return (
        <div style={{marginTop: '150px'}}>
        <div className="container mt-5" >
           
            <div className="card mb-4">
            
                <div className="row g-0">
                <button className='btn btn-link w-100' onClick={handleNavigate}>Back</button>
                    <div className="col-md-4">
                        <img 
                            src={bookInfo.image_url} 
                            alt={bookInfo.title} 
                            className="img-fluid rounded-start" 
                            style={{ maxHeight: '100%', }} 
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
                                            {/* <button 
                                                className="btn btn-link" 
                                                onClick={() => setEditingReview(review)}
                                            >
                                               <span role="img" aria-label="edit">
                                                        ✏️
                                                 </span>
                                            </button>
                                            <button className='btn btn-link' onClick={() => handleDeleteReview(review.id)}>
                                            <span role="img" aria-label="delete">
                                                🗑
                                            </span>
                                            </button> */}
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
    {({ isSubmitting }) => (
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
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {editingReview ? 'Update Review' : 'Add Review'}
            </button>
        </Form>
    )}
</Formik>

                {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
                        </div>
                    </div>
                </div>
            </div>
            <h3 className='text-center title'>Related Books: </h3>
            <div className='row g-3'>
            {related_books.map((related)=> (
                <div key={related.id} className='card col-md-4'
                onClick={() => handleNavigation(related.id)} style={{cursor:'pointer'}}>
                    <div className='card-body'>
                    <img className='img-fluid card-img' src={related.image_url} alt={related.title}/>
                    <h4 className='card-title text-center'>{related.title}</h4>
                    </div>
                    </div>

            ))}
            </div>
        </div>
        </div>
    );
};

export default BookDetails;

