from config import db
import datetime as dt

class Book(db.Model):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False, unique=True)
    author = db.Column(db.String, nullable=False, unique=True)
    published_at = db.Column(db.DateTime, nullable=False, default= dt.datetime.utcnow)

    reviews = db.relationship('Review', back_populates='book', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
           
        }