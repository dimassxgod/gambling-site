// server/server.js
const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const app = express();
const PORT = 3000;

// Создание пула соединений к БД
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'casino_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware для логирования запросов
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
    next();
});

// Обслуживание статических файлов
app.use(express.static(path.join(__dirname, '..')));

// Парсинг JSON тела запроса
app.use(express.json());

// API для регистрации
app.post('/api/register', async (req, res) => {
    const { username, password, email } = req.body;
    
    if (!username || !password || !email) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }
    
    try {
        // Проверка существования пользователя
        const [existing] = await pool.query(
            'SELECT * FROM Users WHERE username = ? OR email = ?',
            [username, email]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Пользователь уже существует' });
        }
        
        // Создание нового пользователя
        const [result] = await pool.query(
            'INSERT INTO Users (username, password_hash, email, rating) VALUES (?, ?, ?, 1000)',
            [username, password, email]
        );
        
        const newUser = {
            id: result.insertId,
            username,
            email,
            balance: 1000
        };
        
        res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// API для входа
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const [users] = await pool.query(
            'SELECT id, username, email, rating as balance FROM Users WHERE username = ? AND password_hash = ?',
            [username, password]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
        }
        
        const user = users[0];
        res.json({ 
            user,
            token: 'sample-jwt-token'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// API для получения списка игр
app.get('/api/games', async (req, res) => {
    try {
        const [games] = await pool.query('SELECT * FROM Games');
        res.json(games.map(game => ({
            id: game.id,
            name: game.type,
            minBet: game.type === 'slots' ? 1 : game.type === 'roulette' ? 5 : 10,
            maxBet: game.type === 'slots' ? 100 : game.type === 'roulette' ? 500 : 1000
        })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// API для размещения ставки
app.post('/api/bet', async (req, res) => {
    const { userId, gameId, amount } = req.body;
    
    if (!userId || !gameId || !amount) {
        return res.status(400).json({ error: 'Не все поля указаны' });
    }
    
    try {
        // Получаем пользователя и игру
        const [[user]] = await pool.query(
            'SELECT id, rating as balance FROM Users WHERE id = ?',
            [userId]
        );
        
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        
        const [[game]] = await pool.query(
            'SELECT * FROM Games WHERE id = ?',
            [gameId]
        );
        
        if (!game) {
            return res.status(404).json({ error: 'Игра не найдена' });
        }
        
        // Определяем min/max ставки для игры
        const minBet = game.type === 'slots' ? 1 : game.type === 'roulette' ? 5 : 10;
        const maxBet = game.type === 'slots' ? 100 : game.type === 'roulette' ? 500 : 1000;
        
        if (amount < minBet || amount > maxBet) {
            return res.status(400).json({ 
                error: `Ставка должна быть между ${minBet} и ${maxBet}` 
            });
        }
        
        if (user.balance < amount) {
            return res.status(400).json({ error: 'Недостаточно средств' });
        }
        
        // Простая логика выигрыша (50/50 шанс)
        const win = Math.random() > 0.5;
        const winAmount = win ? amount * 2 : -amount;
        const newBalance = user.balance + winAmount;
        
        // Обновляем баланс пользователя
        await pool.query(
            'UPDATE Users SET rating = ? WHERE id = ?',
            [newBalance, userId]
        );
        
        // Записываем ставку в историю
        await pool.query(
            'INSERT INTO Bets (user_id, game_id, entry_rating, outcome, win_amount) VALUES (?, ?, ?, ?, ?)',
            [userId, gameId, amount, win ? 'win' : 'lose', win ? amount * 2 : 0]
        );
        
        res.json({
            success: true,
            win,
            winAmount: win ? amount * 2 : 0,
            newBalance
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
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