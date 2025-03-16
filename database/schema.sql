CREATE DATABASE casino_db;
USE casino_db;

-- Таблиця користувачів
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rating DECIMAL(10,2) DEFAULT 0.00,
    level INT DEFAULT 1,
    experience INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблиця ігор
CREATE TABLE Games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('roulette', 'aviator', 'slots') NOT NULL
);

-- Таблиця ставок
CREATE TABLE Bets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    entry_rating DECIMAL(10,2) NOT NULL,
    outcome ENUM('win', 'lose', 'draw') NOT NULL,
    win_amount DECIMAL(10,2) DEFAULT 0.00,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES Games(id) ON DELETE CASCADE
);
