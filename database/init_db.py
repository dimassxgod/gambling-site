from sqlalchemy import create_engine
from config import DATABASE_URL
from models import Base

# Подключение к MySQL
engine = create_engine(DATABASE_URL)

# Создание всех таблиц
Base.metadata.create_all(engine)

print("База данных и таблицы созданы!")
