from sqlalchemy import Column, Integer, String, DECIMAL, TIMESTAMP, Enum, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = 'Users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    rating = Column(DECIMAL(10,2), default=0.00)
    level = Column(Integer, default=1)
    experience = Column(Integer, default=0)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

class Game(Base):
    __tablename__ = 'Games'
    id = Column(Integer, primary_key=True, autoincrement=True)
    type = Column(Enum('roulette', 'aviator', 'slots'), nullable=False)

class Bet(Base):
    __tablename__ = 'Bets'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('Users.id', ondelete="CASCADE"), nullable=False)
    game_id = Column(Integer, ForeignKey('Games.id', ondelete="CASCADE"), nullable=False)
    entry_rating = Column(DECIMAL(10,2), nullable=False)
    outcome = Column(Enum('win', 'lose', 'draw'), nullable=False)
    win_amount = Column(DECIMAL(10,2), default=0.00)
    timestamp = Column(TIMESTAMP, default=datetime.utcnow)
