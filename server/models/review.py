from config import db
import datetime as dt

class Review(db.Model):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)

    user = db.relationship('User', back_populates='reviews')
    book = db.relationship('Book', back_populates='reviews')

    def to_dict(self):
        return {
            'id':self.id,
            'content': self.content,
            'rating': self.rating,
            'user_id': self.user_id,
            'book_id': self.book_id,
        }
    def __repr__(self):
        return f'<Review {self.id}, {self.content},{self.rating}, {self.created_at}, {self.user_id}, {self.book_id}>'