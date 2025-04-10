const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const crypto = require('crypto');
const app = express();
const PORT = 3000;

// Пул соединений к БД (оставляем как есть)
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'casino_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
    next();
});
app.use(express.static(path.join(__dirname, '..')));
app.use(express.json());

// Хеширование пароля (простая реализация без bcrypt)
const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// Регистрация с хешированием пароля
app.post('/api/register', async (req, res) => {
    const { username, password, email } = req.body;
    
    if (!username || !password || !email) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }
    
    try {
        const [existing] = await pool.query(
            'SELECT id FROM Users WHERE username = ? OR email = ?',
            [username, email]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Пользователь уже существует' });
        }
        
        const [result] = await pool.query(
            'INSERT INTO Users (username, password_hash, email, balance) VALUES (?, ?, ?, 1000)',
            [username, hashPassword(password), email]
        );
        
        res.status(201).json({
            id: result.insertId,
            username,
            balance: 1000
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Вход с проверкой хеша пароля
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const [users] = await pool.query(
            'SELECT id, username, balance FROM Users WHERE username = ? AND password_hash = ?',
            [username, hashPassword(password)]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Неверные данные' });
        }
        
        res.json(users[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Ставки с транзакцией
app.post('/api/bet', async (req, res) => {
    const { userId, gameId, amount } = req.body;
    
    if (!userId || !gameId || !amount) {
        return res.status(400).json({ error: 'Не все поля указаны' });
    }
    
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        // Получаем данные с блокировкой
        const [[user]] = await connection.query(
            'SELECT balance FROM Users WHERE id = ? FOR UPDATE',
            [userId]
        );
        
        const [[game]] = await connection.query(
            'SELECT * FROM Games WHERE id = ?',
            [gameId]
        );
        
        // Валидация
        if (!user || !game) {
            await connection.rollback();
            return res.status(404).json({ error: 'Данные не найдены' });
        }
        
        const minBet = game.type === 'slots' ? 1 : 5;
        const maxBet = game.type === 'slots' ? 100 : 500;
        
        if (amount < minBet || amount > maxBet) {
            await connection.rollback();
            return res.status(400).json({ error: `Ставка должна быть ${minBet}-${maxBet}` });
        }
        
        if (user.balance < amount) {
            await connection.rollback();
            return res.status(400).json({ error: 'Недостаточно средств' });
        }
        
        // Логика игры
        const win = Math.random() > 0.5;
        const winAmount = win ? amount * 2 : -amount;
        const newBalance = user.balance + winAmount;
        
        // Обновляем баланс
        await connection.query(
            'UPDATE Users SET balance = ? WHERE id = ?',
            [newBalance, userId]
        );
        
        // Записываем ставку
        await connection.query(
            'INSERT INTO Bets (user_id, game_id, amount, outcome, win_amount) VALUES (?, ?, ?, ?, ?)',
            [userId, gameId, amount, win ? 'win' : 'lose', win ? amount * 2 : 0]
        );
        
        await connection.commit();
        res.json({
            success: true,
            win,
            winAmount: win ? amount * 2 : 0,
            newBalance
        });
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    } finally {
        connection.release();
    }
});

// Получение списка игр с кэшированием
let gamesCache = null;
let cacheTimestamp = 0;

app.get('/api/games', async (req, res) => {
    try {
        // Кэшируем на 5 минут
        if (Date.now() - cacheTimestamp < 300000 && gamesCache) {
            return res.json(gamesCache);
        }

        const [games] = await pool.query('SELECT * FROM Games');
        
        gamesCache = games.map(game => ({
            id: game.id,
            name: game.name || game.type,
            type: game.type,
            minBet: calculateMinBet(game.type),
            maxBet: calculateMaxBet(game.type),
            description: game.description || '',
            imageUrl: game.image_url || `/images/${game.type}.jpg`
        }));
        
        cacheTimestamp = Date.now();
        
        res.json(gamesCache);
    } catch (err) {
        console.error('Ошибка получения списка игр:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

function calculateMinBet(gameType) {
    const bets = { slots: 1, roulette: 5, blackjack: 10, poker: 25 };
    return bets[gameType] || 5;
}

function calculateMaxBet(gameType) {
    const bets = { slots: 100, roulette: 500, blackjack: 1000, poker: 5000 };
    return bets[gameType] || 500;
}

// Получение истории ставок пользователя
app.get('/api/user/:userId/history', async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 10, offset = 0 } = req.query;
        
        const [bets] = await pool.query(
            `SELECT b.*, g.name as game_name, g.type as game_type 
             FROM Bets b
             JOIN Games g ON b.game_id = g.id
             WHERE b.user_id = ?
             ORDER BY b.created_at DESC
             LIMIT ? OFFSET ?`,
            [userId, parseInt(limit), parseInt(offset)]
        );
        
        const [[{ count }]] = await pool.query(
            'SELECT COUNT(*) as count FROM Bets WHERE user_id = ?',
            [userId]
        );
        
        res.json({
            bets: bets.map(bet => ({
                id: bet.id,
                amount: bet.amount,
                outcome: bet.outcome,
                winAmount: bet.win_amount,
                date: bet.created_at,
                game: {
                    id: bet.game_id,
                    name: bet.game_name,
                    type: bet.game_type
                }
            })),
            total: count
        });
    } catch (err) {
        console.error('Ошибка получения истории:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получение информации о пользователе
app.get('/api/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const [[user]] = await pool.query(
            `SELECT u.*, 
                (SELECT COUNT(*) FROM Bets WHERE user_id = u.id AND outcome = 'win') as wins,
                (SELECT COUNT(*) FROM Bets WHERE user_id = u.id AND outcome = 'lose') as losses
             FROM Users u
             WHERE u.id = ?`,
            [userId]
        );
        
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            balance: user.balance,
            stats: {
                wins: user.wins,
                losses: user.losses,
                totalBets: user.wins + user.losses
            },
            registeredAt: user.created_at
        });
    } catch (err) {
        console.error('Ошибка получения пользователя:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Обслуживание статических файлов и SPA роутинг
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ 
            error: 'Endpoint не найден',
            availableEndpoints: [
                'POST /api/register',
                'POST /api/login',
                'POST /api/bet',
                'GET /api/games',
                'GET /api/user/:id',
                'GET /api/user/:id/history'
            ]
        });
    }
    
    // Для всех остальных запросов возвращаем index.html
    res.sendFile(path.join(__dirname, '..', 'index.html'), err => {
        if (err) {
            console.error('Ошибка отправки index.html:', err);
            res.status(404).send('Страница не найдена');
        }
    });
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error('Глобальная ошибка:', err.stack);
    res.status(500).json({ 
        error: 'Внутренняя ошибка сервера',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log(`Дата и время запуска: ${new Date().toLocaleString()}`);
});