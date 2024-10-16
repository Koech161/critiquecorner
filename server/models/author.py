from config import db


class Author(db.Model):
    __tablename__ = 'authors'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)

    books = db.relationship('Book', back_populates='author', cascade='all, delete-orphan', lazy=True)

    def __repr__(self):
        return f'<Author {self.id}, {self.name}>'