from fastapi import FastAPI
from app.database import init_db  # Подключаем БД
from app.routes import router  # Подключаем роуты

app = FastAPI()

# Подключаем маршруты API
app.include_router(router)

# Инициализация базы данных при запуске
@app.on_event("startup")
async def startup():
    await init_db()

@app.get("/")
def home():
    return {"message": "Трекер тренировок API работает!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True) 
