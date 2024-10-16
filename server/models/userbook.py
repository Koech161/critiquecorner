from config import db
import datetime as dt

class UsersBook(db.Model):
    __tablename__ = 'userbooks'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    date_added = db.Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)

    user = db.relationship('User', back_populates='users_books')
    book = db.relationship('Book', back_populates='users_books')

    def __repr__(self):
        return f'<UserBook {self.id}, {self.user_id}, {self.book_id}>'