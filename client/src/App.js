
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
     <div>
  {books.length > 0 ? (
    books.map((book) => (
      <div key={book.id}>
        <h1>{book.title}</h1>
        <h3>{book.author}</h3>
        <button>Add Review</button>
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
