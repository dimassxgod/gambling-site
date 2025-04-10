const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '12345', // ваш пароль MySQL
    database: 'casino_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Проверка подключения при старте
pool.getConnection()
    .then(conn => {
        console.log('✅ Успешное подключение к MySQL');
        conn.release();
    })
    .catch(err => {
        console.error('❌ Ошибка подключения к MySQL:', err);
        process.exit(1);
    });

module.exports = pool;