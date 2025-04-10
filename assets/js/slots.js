// slots.js - версия без модулей

// Глобальные переменные для слотов
const SLOTS_SYMBOLS = ["🍒", "🍋", "🍊", "🍇", "7️⃣"];
const SLOTS_PAYOUTS = [3, 5, 8, 10, 50];
let isSpinning = false;

// Функция для показа уведомлений (аналогичная utils.js)
function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Функция для обновления кредитов (аналогичная utils.js)
function updateCredits(amount) {
    const creditsElement = document.getElementById("credits");
    if (creditsElement) {
        const current = parseInt(creditsElement.textContent.match(/\d+/)[0], 10);
        const newAmount = current + amount;
        creditsElement.textContent = `💰 ${newAmount} кредитов`;
        
        // Обновляем данные в localStorage
        const userData = getUserData();
        if (userData.username) {
            userData.credits = newAmount;
            saveUserData(userData);
        }
    }
}

// Функция для получения данных пользователя (аналогичная utils.js)
function getUserData() {
    return JSON.parse(localStorage.getItem("allcashUserData") || "{}");
}

// Функция для сохранения данных пользователя (аналогичная utils.js)
function saveUserData(userData) {
    localStorage.setItem("allcashUserData", JSON.stringify(userData));
}

// Основная функция для отображения секции слотов
function showSlotsSection() {
    const mainContent = document.querySelector(".main-content");
    
    let slotsSection = document.getElementById("slots-section");
    
    if (!slotsSection) {
        slotsSection = document.createElement("div");
        slotsSection.id = "slots-section";
        slotsSection.className = "content-section";
        
        slotsSection.innerHTML = `
            <div class="section-header">
                <div class="section-title">
                    <img src="assets/images/icons/slots.png" alt="Slots" class="section-icon">
                    Слоты
                </div>
                <div class="section-dropdown">
                    <span>По популярности</span>
                    <img src="assets/images/icons/down.png" alt="Down" class="dropdown-icon">
                </div>
            </div>
            <div class="games-grid">
                <div class="game-item">
                    <img src="assets/images/slots/slot1.jpg" alt="Slot 1" class="game-image">
                    <div class="game-overlay">
                        <button class="play-button" data-game="slot1">Play now</button>
                    </div>
                    <div class="game-title">FRUIT SPIN</div>
                </div>
                <div class="game-item">
                    <img src="assets/images/slots/slot2.jpg" alt="Slot 2" class="game-image">
                    <div class="game-overlay">
                        <button class="play-button" data-game="slot2">Play now</button>
                    </div>
                    <div class="game-title">LUCKY 7</div>
                </div>
                <div class="game-item">
                    <img src="assets/images/slots/slot3.jpg" alt="Slot 3" class="game-image">
                    <div class="game-overlay">
                        <button class="play-button" data-game="slot3">Play now</button>
                    </div>
                    <div class="game-title">MEGA FORTUNE</div>
                </div>
                <div class="game-item">
                    <img src="assets/images/slots/slot4.jpg" alt="Slot 4" class="game-image">
                    <div class="game-overlay">
                        <button class="play-button" data-game="slot4">Play now</button>
                    </div>
                    <div class="game-title">SPACE ADVENTURE</div>
                </div>
            </div>
        `;
        
        mainContent.appendChild(slotsSection);
        
        // Добавляем обработчики для кнопок Play
        const playButtons = slotsSection.querySelectorAll(".play-button");
        playButtons.forEach(button => {
            button.addEventListener("click", function() {
                const gameId = this.getAttribute("data-game");
                startGame(gameId);
            });
        });
    } else {
        slotsSection.style.display = "block";
    }
}

// Функция для начала игры
function startGame(gameId) {
    const userData = getUserData();
    if (!userData.username) {
        showNotification("Для игры необходимо зарегистрироваться", "error");
        return;
    }

    const gameModal = createGameModal(gameId);
    document.body.appendChild(gameModal);
    gameModal.style.display = "flex";

    initializeSlotGame(gameModal, gameId);
}

// Создание модального окна для игры
function createGameModal(gameId) {
    const gameModal = document.createElement("div");
    gameModal.className = "modal";
    gameModal.id = `${gameId}Modal`;
    
    const gameDetails = getGameDetails(gameId);
    
    gameModal.innerHTML = `
        <div class="modal-content game-modal-content">
            <span class="close-btn">&times;</span>
            <h2>${gameDetails.title}</h2>
            ${gameDetails.content}
        </div>
    `;
    
    // Обработчик закрытия модального окна
    const closeBtn = gameModal.querySelector(".close-btn");
    closeBtn.addEventListener("click", function() {
        document.body.removeChild(gameModal);
    });
    
    gameModal.addEventListener("click", function(e) {
        if (e.target === gameModal) {
            document.body.removeChild(gameModal);
        }
    });
    
    return gameModal;
}

// Получение деталей игры
function getGameDetails(gameId) {
    const games = {
        "slot1": { title: "FRUIT SPIN", content: createSlotGameContent() },
        "slot2": { title: "LUCKY 7", content: createSlotGameContent() },
        "slot3": { title: "MEGA FORTUNE", content: createSlotGameContent() },
        "slot4": { title: "SPACE ADVENTURE", content: createSlotGameContent() }
    };
    
    return games[gameId] || { title: "Game", content: "<p>Эта игра в разработке</p>" };
}

// Создание контента для игрового автомата
function createSlotGameContent() {
    return `
        <div class="slot-game-container">
            <div class="slot-display">
                <div class="slot-reels">
                    <div class="reel" id="reel1"></div>
                    <div class="reel" id="reel2"></div>
                    <div class="reel" id="reel3"></div>
                </div>
            </div>
            <div class="slot-controls">
                <div class="bet-controls">
                    <button class="bet-btn minus">-</button>
                    <input type="number" id="slot-bet-value" value="50" min="10" max="1000">
                    <button class="bet-btn plus">+</button>
                </div>
                <button id="spin-slot-btn" class="spin-button">СПИН!</button>
            </div>
            <div class="slot-info">
                <div class="slot-win-display">Выигрыш: <span id="win-amount">0</span></div>
                <div class="slot-paytable">
                    <h3>Таблица выплат</h3>
                    <div class="paytable-item">
                        <span>🍒🍒🍒</span>
                        <span>x3</span>
                    </div>
                    <div class="paytable-item">
                        <span>🍋🍋🍋</span>
                        <span>x5</span>
                    </div>
                    <div class="paytable-item">
                        <span>🍊🍊🍊</span>
                        <span>x8</span>
                    </div>
                    <div class="paytable-item">
                        <span>🍇🍇🍇</span>
                        <span>x10</span>
                    </div>
                    <div class="paytable-item">
                        <span>7️⃣7️⃣7️⃣</span>
                        <span>x50</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Инициализация игрового автомата
function initializeSlotGame(gameModal, gameId) {
    const reels = [
        gameModal.querySelector("#reel1"),
        gameModal.querySelector("#reel2"),
        gameModal.querySelector("#reel3")
    ];

    // Инициализация барабанов
    reels.forEach(reel => {
        if (reel) {
            reel.innerHTML = '';
            for (let i = 0; i < 3; i++) {
                const symbol = document.createElement("div");
                symbol.className = "slot-symbol";
                symbol.textContent = SLOTS_SYMBOLS[Math.floor(Math.random() * SLOTS_SYMBOLS.length)];
                reel.appendChild(symbol);
            }
        }
    });

    // Обработчики для кнопок ставок
    const betInput = gameModal.querySelector("#slot-bet-value");
    const minusBtn = gameModal.querySelector(".bet-btn.minus");
    const plusBtn = gameModal.querySelector(".bet-btn.plus");
    
    if (minusBtn && betInput) {
        minusBtn.addEventListener("click", function() {
            adjustBet(betInput, -10);
        });
    }
    
    if (plusBtn && betInput) {
        plusBtn.addEventListener("click", function() {
            adjustBet(betInput, 10);
        });
    }

    // Обработчик для кнопки Spin
    const spinBtn = gameModal.querySelector("#spin-slot-btn");
    if (spinBtn) {
        spinBtn.addEventListener("click", function() {
            if (!isSpinning) {
                spinSlot(gameModal, reels, gameId);
            }
        });
    }
}

// Функция для изменения ставки
function adjustBet(betInput, change) {
    let value = parseInt(betInput.value, 10);
    value = Math.max(10, Math.min(1000, value + change));
    betInput.value = value;
}

// Функция для вращения барабанов
function spinSlot(gameModal, reels, gameId) {
    const betInput = gameModal.querySelector("#slot-bet-value");
    if (!betInput) return;
    
    const betAmount = parseInt(betInput.value, 10);
    const creditsElement = document.getElementById("credits");
    if (!creditsElement) return;
    
    const currentCredits = parseInt(creditsElement.textContent.match(/\d+/)[0], 10);
    const spinBtn = gameModal.querySelector("#spin-slot-btn");
    
    if (betAmount > currentCredits) {
        showNotification("Недостаточно кредитов для ставки", "error");
        return;
    }

    isSpinning = true;
    if (spinBtn) {
        spinBtn.disabled = true;
        spinBtn.textContent = "ВРАЩЕНИЕ...";
    }
    
    updateCredits(-betAmount);

    // Генерация результатов
    const results = [];
    reels.forEach((reel, index) => {
        if (reel) {
            reel.style.animation = `spin 0.5s ${index * 0.3}s cubic-bezier(0.25, 0.1, 0.25, 1) 3`;
            results.push(Math.floor(Math.random() * SLOTS_SYMBOLS.length));
        }
    });

    // Обновление после анимации
    setTimeout(() => {
        reels.forEach((reel, index) => {
            if (reel) {
                reel.innerHTML = '';
                for (let i = 0; i < 3; i++) {
                    const symbol = document.createElement("div");
                    symbol.className = "slot-symbol";
                    const symbolIndex = (results[index] + i) % SLOTS_SYMBOLS.length;
                    symbol.textContent = SLOTS_SYMBOLS[symbolIndex];
                    reel.appendChild(symbol);
                }
                reel.style.animation = "none";
            }
        });

        // Расчет выигрыша
        const win = calculateWin(results, betAmount);
        if (win > 0) {
            updateCredits(win);
            showNotification(`Победа! ${win} кредитов!`, "success");
            
            // Обновление отображения выигрыша
            const winAmountElement = gameModal.querySelector("#win-amount");
            if (winAmountElement) {
                winAmountElement.textContent = win;
            }
        }

        if (spinBtn) {
            spinBtn.disabled = false;
            spinBtn.textContent = "СПИН!";
        }
        isSpinning = false;
        updateGamesPlayed();
    }, 2000);
}

// Расчет выигрыша
function calculateWin(results, betAmount) {
    if (results.length >= 3 && results[0] === results[1] && results[1] === results[2]) {
        return betAmount * SLOTS_PAYOUTS[results[0]];
    }
    return 0;
}

// Обновление счетчика сыгранных игр
function updateGamesPlayed() {
    const userData = getUserData();
    if (userData.username) {
        userData.gamesPlayed = (userData.gamesPlayed || 0) + 1;
        saveUserData(userData);
    }
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", function() {
    // Добавляем обработчик для кнопки слотов в навигации
    const slotsBtn = document.getElementById("slotsBtn");
    if (slotsBtn) {
        slotsBtn.addEventListener("click", function(e) {
            e.preventDefault();
            showSlotsSection();
        });
    }
    
    // Делаем функцию доступной глобально (если нужно)
    window.showSlotsSection = showSlotsSection;
});