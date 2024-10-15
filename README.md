# Book-review
A full-stack application that manages books and allow user to add review for each book.

## Features
- Display books details
- Display all reviews for each book
- User can register account
- User login/logout
- Admin functionality to add books
- User can add edit and delete reviews

 ## How to install and run the project
- git clone [git@github.com:Koech161/critiquecorner.git](git@github.com:Koech161/critiquecorner.git) to your local enviroment

 **Front-end**

  - `run  npm install --prefix client`
  - `npm start --prefix client`

 **Server-side**
- Open another terminal window
- Activate virtual enviroment:
     - `pipenv install`
     - `pipenv shell`
- cd to server
- Run migrations. skip if initial migration is already done:
    - `flask db init`
    - `flask migrate -m 'initial migrations'`
    -  `flask db upgrade`
- Run the server appliction
     - `python app.py`    

 **API Endpoints**

 - GET '/books' - Get list of books
 - POST '/books'  - Add a new book to the database
 - PATCH '/books/id' - Remove a book from database
 - DELETE '/books/id' - Remove a book from the database
 - POST '/users' - Add a new user to the database
 - POST '/login' - Authenticate a user 
 - DELETE '/login' - Logout the user 
 - POST '/reviews' - Add a new review to the database
 - PATCH '/reviews/id' - Update a review
 - DELETE '/reviews/id' - Remove a reviews from database
