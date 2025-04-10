-- Создание базы данных
CREATE DATABASE IF NOT EXISTS casino_db;
USE casino_db;

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    balance DECIMAL(15, 2) DEFAULT 1000.00,
    level INT DEFAULT 1,
    experience INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT chk_balance CHECK (balance >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Таблица игр
CREATE TABLE IF NOT EXISTS Games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    type ENUM('slots', 'roulette', 'blackjack', 'aviator', 'poker') NOT NULL,
    min_bet DECIMAL(10, 2) NOT NULL,
    max_bet DECIMAL(10, 2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Таблица ставок
CREATE TABLE IF NOT EXISTS Bets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    outcome ENUM('win', 'lose', 'draw') NOT NULL,
    payout DECIMAL(15, 2) DEFAULT 0.00,
    balance_before DECIMAL(15, 2) NOT NULL,
    balance_after DECIMAL(15, 2) NOT NULL,
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES Games(id) ON DELETE CASCADE,
    INDEX idx_user_bets (user_id, created_at),
    INDEX idx_game_bets (game_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Таблица транзакций (депозиты/выводы)
CREATE TABLE IF NOT EXISTS Transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    type ENUM('deposit', 'withdrawal', 'bonus', 'penalty') NOT NULL,
    status ENUM('pending', 'completed', 'rejected') DEFAULT 'pending',
    payment_method VARCHAR(50),
    transaction_reference VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    INDEX idx_user_transactions (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Таблица сессий (для аутентификации)
CREATE TABLE IF NOT EXISTS Sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    INDEX idx_session_token (token),
    INDEX idx_user_sessions (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Начальные данные для игр
INSERT INTO Games (name, type, min_bet, max_bet, description) VALUES
('Lucky Slots', 'slots', 1.00, 100.00, 'Classic 3-reel slot machine with bonus rounds'),
('European Roulette', 'roulette', 5.00, 500.00, 'Traditional roulette with single zero'),
('Blackjack Pro', 'blackjack', 10.00, 1000.00, '21-point game with professional dealer'),
('Aviator', 'aviator', 1.00, 500.00, 'Crash-style game with increasing multiplier'),
('Texas Hold''em', 'poker', 20.00, 2000.00, 'Popular poker variant with tournaments');

-- Создание пользователя администратора (пароль: admin123)
INSERT INTO Users (username, email, password_hash, balance, is_active) VALUES
('admin', 'admin@casino.com', '$2a$10$N9qo8uLOickgx3ZmrMZIu.1J9O3YLYLYE/QT5H5XUz1tXORhXyC3K', 10000.00, TRUE);

-- Создание тестового пользователя (пароль: test123)
INSERT INTO Users (username, email, password_hash, balance, is_active) VALUES
('test_user', 'user@casino.com', '$2a$10$VE0ZvAnjQdY6W9q6KlvV.eKx3e5GYZQz7JXo9VlO2LQ1JkQmZJ1XK', 5000.00, TRUE);