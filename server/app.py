from flask import Flask, request, jsonify, redirect, url_for, g
from models.book import Book
from models.review import Review
from models.user import User
from config import db
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS
import jwt
from functools import wraps
import string
import os
import random
import base64
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from dotenv import load_dotenv
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)
CORS(app)
load_dotenv()
app.config['SECRET_KEY'] = base64.b64encode(os.urandom(24)).decode('utf-8')
cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME')
api_key=os.getenv('CLOUDINARY_API_KEY')
api_secret=os.getenv('CLOUDINARY_API_SECRET')
cloudinary.config(
    cloud_name=cloud_name,
    api_key=api_key,
    api_secret=api_secret,
    secure =True
)
# secure routes  
# use @jwt_required decorator to secure routes
def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwags):
        token = None

        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
            

        if not token:
            return {'meassage':'Token is missing'}, 403
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            g.current_user = User.query.get(data['user_id'])
        except Exception:
            return  {'message': 'Token is invalid or expired'}, 403
        return f(*args, **kwags) 
    return decorated



#pip install flask_admin
#admin_dash_board
class MyModelView(ModelView):
    def is_accessible(self):
        # return hasattr(g, 'current_user') and g.current_user is not None 
        return True
   
    def access_denied(self):
        return redirect(url_for('home'))
    can_create = True
    can_edit = True
    can_delete =True

admin = Admin(app, name='CritiqueCorner Admin', template_mode='bootstrap3')
admin.add_view(MyModelView(Book, db.session))
admin.add_view(MyModelView(Review, db.session))
admin.add_view(MyModelView(User, db.session))   

class Home(Resource):
    def get(self):
        return 'Welcome to Book review'
    
class Register(Resource):
    def post(self):
        data = request.get_json()
        if not data or 'username' not in data or 'email' not in data or 'password' not in data:
            return {'error': 'invalid Credentials'}, 400
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        hash_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_user = User(username=username, email=email, password=hash_password)
        try:
            db.session.add(new_user)
            db.session.commit()
            return {'message': 'User registered succesfully', 'User': new_user.username}, 201
        except Exception as e:
            return {'Registration error': str(e)}, 500
        
class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        user = User.query.filter_by(username=username).first()

        if user and check_password_hash(user.password, password):

            expiration_time =  datetime.utcnow() + timedelta(days=7)

            token = jwt.encode({'user_id': user.id, 'exp': expiration_time }, app.config['SECRET_KEY'], algorithm='HS256')

            return {'message': 'Login succesfully', 'token': token}, 201
        else:
            return {'error': 'Invalid user credentials'}, 400
    def delete(self):
       return {'user logout'}   

class AddBook(Resource):
    @jwt_required
    def post(self):

        if 'file'  not in request.files:
            return {'error': 'No file part'}, 400
        file = request.files['file']
        if file.filename == '':
            return {'error':'No selected file'}, 400
        data = request.form
        title = data.get('title')
        author = data.get('author')
        if not title or not author:
            return {'error': 'Invalid input'}, 400
       
        try:
            upload_result = cloudinary.uploader.upload(file, resource_type= 'image')
            image_url = upload_result['secure_url']
            newbook = Book(title=title, author=author, image_filename=image_url)
            db.session.add(newbook)
            db.session.commit()
            return {'message':'Book added successfully','book': newbook.title, 'author': newbook.author}, 201
        except Exception as e:
            db.session.rollback()
            return {'Adding book error': str(e)}, 500
    # @jwt_required
    def get(self):
        books = Book.query.all()
        print(books)
        if books:
            book_dict = [book.to_dict() for book in books]
            print(book_dict)
            return jsonify(book_dict)
        else:
            return {'error': 'No books found'} ,404

class BookByID(Resource):
    @jwt_required
    def delete(self, id):
        book = Book.query.get(id)
        if not book:
            return {'error': 'No book found'},404
        db.session.delete(book)  
        db.session.commit()
        return {'message': f'Book {book.title} deleted successfully'}, 200
    @jwt_required
    def patch(self, id):
        book = Book.query.get(id)
        if not book:
            return {'error': 'No book found'}, 404
        data = request.get_json()
        if not data:
            return {'error': 'No data provided'}
        for attr, value in data.items():
            setattr(book, attr, value)

        try:
            db.session.commit()
            return {'message': 'Book updated successfully', 'book': book.title},201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500 

class AddReview(Resource):

    @jwt_required
    def get(self):
        reviews = Review.query.all()
        if not reviews:
            return {'error': 'Reviews not found'}, 404
        return reviews.to_dict(), 200


    @jwt_required
    def post(self):
        data = request.get_json()
        content = data.get('content')
        rating = data.get('rating')
        user_id = data.get('user_id')
        book_id= data.get('book_id')
        if not content or not rating or not user_id or not book_id:
            return {'error': 'Invalid input'},400
        new_review = Review(content=content, rating=rating, user_id=user_id, book_id=book_id)

        try:
            db.session.add(new_review)
            db.session.commit()
            return {'message': 'Review added successfully', 'review':new_review.content, 'rating': new_review.rating}
        except Exception as e:
            return {'error': str(e)},500

class ReviewByID(Resource):
    @jwt_required
    def patch(self, id):
        review = Review.query.get(id)
        if not review:
            return {'error': 'Review not found'}, 404
        data = request.get_json()
        if not data:
            return {'error': 'No input provided'}, 404
        for attr, value in data.items():
            setattr(review, attr, value)  

        try:
            db.session.commit()
            return {'message':'Review updated successfully', 'review': review.to_dict() }, 201
        except Exception as e:
            db.session.rollback()
            return {'error updating review':str(e)}, 500  
    @jwt_required
    def delete(self, id):
        review = Review.query.get(id)
        if not review:
            return {'error': 'Review not found'}, 404
        db.session.delete(review)
        db.session.commit()
        return {'message':'Review deleted succesfully'}, 200   
        
        



api.add_resource(Home, '/')
api.add_resource(Register, '/users') 
api.add_resource(Login, '/login')  
api.add_resource(AddBook, '/books') 
api.add_resource(BookByID, '/books/<int:id>')
api.add_resource(AddReview, '/reviews')
api.add_resource(ReviewByID, '/reviews/<int:id>')

    

if __name__ == '__main__':
    app.run(port=5555, debug=True)