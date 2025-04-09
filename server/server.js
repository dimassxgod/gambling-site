// server/server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware для логирования запросов
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
    next();
});

// Обслуживание статических файлов
app.use(express.static(path.join(__dirname, '..')));

// Парсинг JSON тела запроса
app.use(express.json());

// Имитация базы данных для пользователей
let users = [];
// Имитация базы данных для игр
let games = [
    { id: 1, name: "Slots", minBet: 1, maxBet: 100 },
    { id: 2, name: "Roulette", minBet: 5, maxBet: 500 },
    { id: 3, name: "Blackjack", minBet: 10, maxBet: 1000 }
];

// API для регистрации
app.post('/api/register', (req, res) => {
    const { username, password, email } = req.body;
    
    if (!username || !password || !email) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }
    
    // Проверка существования пользователя
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ error: 'Пользователь уже существует' });
    }
    
    const newUser = {
        id: users.length + 1,
        username,
        password, // В реальном приложении пароль должен быть захеширован
        email,
        balance: 1000, // Начальный баланс
        created: new Date()
    };
    
    users.push(newUser);
    
    // Не отправляем пароль обратно
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
});

// API для входа
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
    }
    
    // В реальном приложении здесь бы генерировался JWT токен
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token: 'sample-jwt-token' });
});

// API для получения списка игр
app.get('/api/games', (req, res) => {
    res.json(games);
});

// API для размещения ставки
app.post('/api/bet', (req, res) => {
    const { userId, gameId, amount } = req.body;
    
    if (!userId || !gameId || !amount) {
        return res.status(400).json({ error: 'Не все поля указаны' });
    }
    
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    const game = games.find(g => g.id === gameId);
    if (!game) {
        return res.status(404).json({ error: 'Игра не найдена' });
    }
    
    if (amount < game.minBet || amount > game.maxBet) {
        return res.status(400).json({ 
            error: `Ставка должна быть между ${game.minBet} и ${game.maxBet}` 
        });
    }
    
    if (user.balance < amount) {
        return res.status(400).json({ error: 'Недостаточно средств' });
    }
    
    // Простая логика выигрыша (50/50 шанс)
    const win = Math.random() > 0.5;
    const winAmount = win ? amount * 2 : -amount;
    
    user.balance += winAmount;
    
    res.json({
        success: true,
        win,
        winAmount: win ? amount * 2 : 0,
        newBalance: user.balance
    });
});

// Обработка запросов к несуществующим маршрутам
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint не найден' });
    }
    
    // Для всех других запросов возвращаем index.html
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log(`Дата и время запуска: ${new Date().toLocaleString()}`);
});