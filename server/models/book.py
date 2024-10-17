from config import db
import datetime as dt

class Book(db.Model):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False, unique=True)
    image_filename= db.Column(db.String, nullable=True)
    author_id = db.Column(db.Integer, db.ForeignKey('authors.id'), nullable=False)
    published_at = db.Column(db.DateTime, nullable=False, default= dt.datetime.utcnow)

    author = db.relationship('Author', back_populates='books')
    reviews = db.relationship('Review', back_populates='book', cascade='all, delete-orphan', lazy=True)
    users_books = db.relationship('UsersBook', back_populates='book', cascade='all, delete-orphan', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'image_filename':self.image_filename,
            'author_id': self.author_id,
            'published_at': self.published_at.isoformat(),
        }
    def __repr__(self):
        return f'<Book {self.id}, {self.title}, {self.author_id}, {self.published_at.isoformat()}>'