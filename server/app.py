from flask import Flask, request, jsonify
from models.book import Book
from models.review import Review
from models.user import User
from config import db
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS
import jwt
import string
import os
import random
import base64
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)
CORS(app)

secret_key = base64.b64encode(os.urandom(24)).decode('utf-8')
print(secret_key)

class Home(Resource):
    def get(self):
        return 'Welcome to Book review'
    
class Register(Resource):
    def post(self):
        data = request.get_json()
        if not data or 'username' not in data or 'email' not in data or 'password' not in data:
            return {'error': 'invalid Credentials'}, 400
        username = data['username']
        email = data['email']
        password = data['password']
        hash_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_user = User(username=username, email=email, password=hash_password)
        try:
            db.session.add(new_user)
            db.session.commit()
            return {'error': 'User registered succesfully', 'User': new_user.username}, 201
        except Exception as e:
            return {'error': str(e)}, 500
        
class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data['username']
        password = data['password']

        user = User.query.filter_by(username=username).first()

        if user and check_password_hash(user.password, password):

            expiration_time =  datetime.utcnow() + timedelta(days=7)

            token = jwt.encode({'user_id': user.id, 'exp': expiration_time }, secret_key, algorithm='HS256')

            return {'message': 'Login succesfully', 'token': token}, 201
        else:
            return {'error': 'Invalid user credentials'}, 400

class AddBook(Resource):
    def post(self):
        data = request.get_json()
        if not data or 'title' not in data or 'author' not in data:
            return {'error': 'Invalid input'}, 400
        newbook = Book(title=data['title'], author=data['author'])
        try:
            db.session.add(newbook)
            db.session.commit()
            return {'message':'Book added successfully','book': newbook.title, 'Author': newbook.author}, 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500
    def get(self):
        books = Book.query.all()
        print(books)
        if books:
            book_dict = [book.to_dict() for book in books]
            print(book_dict)
            return jsonify(book_dict)
        else:
            return {'error': 'No books found'} ,400   

class AddReview(Resource):
    def post(self):
        data = request.get_json()

        if not data or 'content' not in data or 'rating' not in data  or 'user_id' not in data or 'book_id' not in data:
            return {'error': 'Invalid input'},400
        new_review = Review(content=data['content'], rating=data['rating'], user_id=data['user_id'], book_id=data['book_id'])

        try:
            db.session.add(new_review)
            db.session.commit()
            return {'message': 'Review added successfully', 'review':new_review.content, 'rating': new_review.rating}
        except Exception as e:
            return {'error': str(e)},500
        



api.add_resource(Home, '/')
api.add_resource(Register, '/users') 
api.add_resource(Login, '/login')  
api.add_resource(AddBook, '/books') 
api.add_resource(AddReview, '/reviews')

    

if __name__ == '__main__':
    app.run(port=5555, debug=True)