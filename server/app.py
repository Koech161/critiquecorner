from flask import Flask, request, jsonify, redirect, url_for, g
from models.book import Book
from models.review import Review
from models.user import User
from models.author import Author
from models.userbook import UsersBook
from config import db
from flask_migrate import Migrate
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
import jwt
from functools import wraps
# from flask_jwt_extended import get_jwt_identity, jwt_required
import os
import base64
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from dotenv import load_dotenv
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_wtf import FlaskForm
from wtforms import SelectField

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)
CORS(app)
load_dotenv()
# secret keys for session tokens
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
    
    def decorated(*args, **kwargs):
        # user_id = get_jwt_identity()
        # g.current_user = User.query.get(user_id)
        # if g.current_user is None:
        #     return  {'error': 'User not found'}, 404
        # return f(*args, **kwargs)

        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
            

        if not token:
            return {'message':'Token is missing'}, 403
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'], options={'verify_signatures': False})
            g.current_user = User.query.get(data['user_id'])
    
        except Exception as e:
            print(f'Token decoding error: {e}')
            return  {'message': 'Token is invalid or expired'}, 403
        return f(*args, **kwargs) 
    return decorated



#pip install flask_admin
#admin_dash_board
class MyModelView(ModelView):
    def is_accessible(self):
         
        #return hasattr(g, 'current_user') and g.current_user is not None 
        return True
   
    def access_denied(self):
        return redirect(url_for('home'))
    can_create = True
    can_edit = True
    can_delete =True
class BookModelView(MyModelView):
    form_columns = ['title', 'image_filename', 'author_id', 'published_at']
    column_searchable_list = ['title', 'author.id']
    column_filters = ['author_id', 'published_at']


    def create_form(self):
        form = super(BookModelView, self).create_form()
        form.author_id.choices = self.get_author_choices()
        return form

    def edit_form(self, obj):
        form = super(BookModelView, self).edit_form(obj)
        form.author_id.choices = self.get_author_choices()
        return form

    def get_author_choices(self):
        authors = Author.query.all()
        return [(author.id, author.name) for author in authors]

class ReviewModelView(MyModelView):
    form_columns = ['content', 'rating', 'user_id', 'book_id']
    column_searchable_list = ['content', 'rating']
    column_filters = ['user_id', 'book_id']

class UserModelView(MyModelView):
    form_columns = ['username', 'email', 'password']
    column_searchable_list = ['username', 'email']
    column_filters =['username']

class AuthorModelView(MyModelView):
    form_columns = ['name']
    column_searchable_list = ['name']

class UsersBookModelView(MyModelView):
    form_columns = ['user_id', 'book_id', 'date_added']   
    column_searchable_list = ['user_id', 'book_id']
    column_filters = ['user_id', 'book_id']


admin = Admin(app, name='CritiqueCorner Admin', template_mode='bootstrap3')
admin.add_view(BookModelView(Book , db.session))
admin.add_view(ReviewModelView(Review, db.session))
admin.add_view(UserModelView(User, db.session))  
admin.add_view(AuthorModelView(Author, db.session)) 
admin.add_view(UsersBookModelView(UsersBook, db.session))

class Home(Resource):
    def get(self):
        return 'Welcome to Book review'
    
    # User Registration
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
     # user Login   
class Login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        user = User.query.filter_by(email=email).first()

        if user and check_password_hash(user.password, password):

            expiration_time =  datetime.utcnow() + timedelta(days=7)

            token = jwt.encode({'user_id': user.id, 'exp': expiration_time }, app.config['SECRET_KEY'], algorithm='HS256' )

            return {'message': 'Login succesfully', 'token': token, 'user': user.id}, 201
        else:
            return {'error': 'Invalid user credentials'}, 400
    def delete(self):
       return {'user logout'}   
    
class UserByID(Resource):
    #@jwt_required
    def get(self,id):
        user = User.query.get_or_404(id)
        userInfo = {
            'id':user.id,
            'username': user.username,
            'email': user.email,
        }  
        return jsonify(userInfo)
    # Admin is the only to add book
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
        author_id = data.get('author_id')
        if not title or not author_id:
            return {'error': 'Invalid input'}, 400
       
        try:
            upload_result = cloudinary.uploader.upload(file, resource_type= 'image')
            image_url = upload_result['secure_url']
            newbook = Book(title=title, image_filename=image_url, author_id=author_id)
            db.session.add(newbook)
            db.session.commit()
            return {'message':'Book added successfully','book': newbook.title, 'author': newbook.author}, 201
        except Exception as e:
            db.session.rollback()
            return {'Adding book error': str(e)}, 500
        
     #Only Authenticated User should view books and add reviews   
    #@jwt_required
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
    def get(self, id):
        book = Book.query.get_or_404(id)
      
        author_name = book.author.name if book.author else 'unknown'
        reviews = Review.query.filter_by(book_id=book.id).all()
        related_books = Book.query.filter(Book.author_id == book.author_id, Book.id != book.id).all()
       
        book_info = {
            'title': book.title,
            'image_url':book.image_filename,
            'published at':book.published_at.isoformat(),
            'author':{
                'id': book.author.id,
                'name': author_name
            },
            'review': [{'content': review.content, 'rating': review.rating, 'username': review.user.username} for review in reviews],
            'related_books': [{'id': related_book.id, 'title': related_book.title, 'image_url': related_book.image_filename} for related_book in related_books]
        }
      
        return jsonify(book_info)
    @jwt_required
    def delete(self, id):
        book = Book.query.get_or_404(id)
    
        db.session.delete(book)  
        db.session.commit()
        return {'message': f'Book {book.title} deleted successfully'}, 200
    @jwt_required
    def patch(self, id):
        book = Book.query.get_or_404(id)
    
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
# Users should add the reviews
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
            db.session.rollback()
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
        
class Authors(Resource):
    @jwt_required
    def get(self):
        authors = Author.query.all()
        if not Authors:
            return {'error': 'No authors found.'}, 404
        author_dict = [author.to_dict() for author in authors]

        return jsonify(author_dict)
    @jwt_required
    def post(self):
        data = request.get_json()

        if not data:
            return {'error': 'No input provided'}, 404
        name = data.get('name')
        new_author = Author(name=name)
        try:
            db.session.add(new_author)
            db.session.commit()
            return {'message': 'Author added successfully', 'author': new_author.name}, 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500

class UsersBooks(Resource):
    @jwt_required
    def get(self):
        
        usersbook = UsersBook.query.filter_by(user_id=id).all()
        if not usersbook:
            return {'error': 'usersbook not found'},404
        usersbook_dict = [userbook.to_dict() for userbook in usersbook]

        return jsonify(usersbook_dict), 200
    @jwt_required
    def post(self):
        data = request.get_json()
        if not data:
            return {'error': 'Not input provided'}, 404
        user_id = g.current_user.id
        book_id = data.get('book_id')

        new_userbook = UsersBook(user_id=user_id, book_id=book_id)

        try:
            db.session.add(new_userbook)
            db.session.commit()
            return {'message': 'new userbook added succesfully'}, 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500
        
class CheckEmail(Resource):
    def post(self):
        data = request.get_json()
        email= data.get('email')
        if not email:
            return {'message': 'Email is required'},404
        user_exists = User.query.filter_by(email=email).first()
        return {'exists': bool(user_exists)}
                 
        



api.add_resource(Home, '/')
api.add_resource(Register, '/users') 
api.add_resource(Login, '/login')  
api.add_resource(UserByID, '/users/<int:id>')
api.add_resource(AddBook, '/books') 
api.add_resource(BookByID, '/books/<int:id>')
api.add_resource(AddReview, '/reviews')
api.add_resource(ReviewByID, '/reviews/<int:id>')
api.add_resource(Authors, '/authors')
api.add_resource(UsersBooks, '/usersbooks')
api.add_resource(CheckEmail, '/check_email')

    

if __name__ == '__main__':
    app.run(port=5000, debug=True)