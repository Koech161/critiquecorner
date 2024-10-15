
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [books, setBooks] = useState({})

  useEffect(() =>{
    fetch('/books')
    .then((res) => res.json())
    .then((data) => {
      setBooks(data)
      console.log(data);
      
    })
  },[])
  return (
    <div className="App">
     <div className='row g-3'>
  {books.length > 0 ? (
    books.map((book) => (
      <div className='col-md-4' key={book.id}>
        <img  className='img-fluid' src={book.image_filename} alt='alt'/>
        <h1>{book.title}</h1>
        <h3>{book.author}</h3>
        <button className='btn bg-success text-white '>Add Review</button>
      </div>
    ))
  ) : (
    <p>No books found.</p>
  )}
</div>

  
    </div>
  );
}

export default App;
