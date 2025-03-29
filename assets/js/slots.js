export function showSlotsSection() {
    const mainContent = document.querySelector(".main-content");
    
    let slotsSection = document.getElementById("slots-section");
    
    if (!slotsSection) {
        slotsSection = document.createElement("div");
        slotsSection.id = "slots-section";
        slotsSection.className = "content-section";
        
        slotsSection.innerHTML = `
            <div class="section-header">
                <div class="section-title">
                    <img src="/api/placeholder/24/24" alt="Slots" class="section-icon">
                    Слоты
                </div>
                <div class="section-dropdown">
                    <span>По популярности</span>
                    <img src="/api/placeholder/16/16" alt="Down" class="dropdown-icon">
                </div>
            </div>
            <div class="games-grid">
                <div class="game-item">
                    <img src="/api/placeholder/200/120" alt="Slot 1" class="game-image">
                    <div class="game-overlay">
                        <button class="play-button" data-game="slot1">Play now</button>
                    </div>
                    <div class="game-title">FRUIT SPIN</div>
                </div>
                <div class="game-item">
                    <img src="/api/placeholder/200/120" alt="Slot 2" class="game-image">
                    <div class="game-overlay">
                        <button class="play-button" data-game="slot2">Play now</button>
                    </div>
                    <div class="game-title">LUCKY 7</div>
                </div>
                <div class="game-item">
                    <img src="/api/placeholder/200/120" alt="Slot 3" class="game-image">
                    <div class="game-overlay">
                        <button class="play-button" data-game="slot3">Play now</button>
                    </div>
                    <div class="game-title">MEGA FORTUNE</div>
                </div>
                <div class="game-item">
                    <img src="/api/placeholder/200/120" alt="Slot 4" class="game-image">
                    <div class="game-overlay">
                        <button class="play-button" data-game="slot4">Play now</button>
                    </div>
                    <div class="game-title">SPACE ADVENTURE</div>
                </div>
            </div>
        `;
        
        mainContent.appendChild(slotsSection);
        
        const playButtons = slotsSection.querySelectorAll(".play-button");
        playButtons.forEach(button => {
            button.addEventListener("click", () => {
                const gameId = button.getAttribute("data-game");
                startGame(gameId);
            });
        });
    } else {
        slotsSection.style.display = "block";
    }
}

function startGame(gameId) {
    const userData = getUserData();
    if (!userData.username) {
        showNotification("Для игры необходимо зарегистрироваться", "error");
        return;
    }
    
    const gameModal = createGameModal(gameId);
    document.body.appendChild(gameModal);
    gameModal.style.display = "flex";
    
    if (gameId.startsWith("slot")) {
        initializeSlotGame(gameModal);
    }
}

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
    
    const closeBtn = gameModal.querySelector(".close-btn");
    closeBtn.addEventListener("click", () => {
        document.body.removeChild(gameModal);
    });
    
    gameModal.addEventListener("click", (e) => {
        if (e.target === gameModal) {
            document.body.removeChild(gameModal);
        }
    });
    
    return gameModal;
}

function getGameDetails(gameId) {
    const games = {
        "slot1": { title: "FRUIT SPIN", content: createSlotGameContent() },
        "slot2": { title: "LUCKY 7", content: createSlotGameContent() },
        "slot3": { title: "MEGA FORTUNE", content: createSlotGameContent() },
        "slot4": { title: "SPACE ADVENTURE", content: createSlotGameContent() }
    };
    
    return games[gameId] || { title: "Game", content: "<p>Эта игра в разработке</p>" };
}

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

function initializeSlotGame(gameModal) {
    const reels = [
        gameModal.querySelector("#reel1"),
        gameModal.querySelector("#reel2"),
        gameModal.querySelector("#reel3")
    ];
    
    const symbols = ["🍒", "🍋", "🍊", "🍇", "7️⃣"];
    
    reels.forEach(reel => {
        for (let i = 0; i < 3; i++) {
            const symbolEl = document.createElement("div");
            symbolEl.className = "slot-symbol";
            symbolEl.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            reel.appendChild(symbolEl);
        }
    });
    
    const minusBtn = gameModal.querySelector(".bet-btn.minus");
    const plusBtn = gameModal.querySelector(".bet-btn.plus");
    const betInput = gameModal.querySelector("#slot-bet-value");
    const spinBtn = gameModal.querySelector("#spin-slot-btn");
    
    minusBtn.addEventListener("click", () => adjustBet(betInput, -10));
    plusBtn.addEventListener("click", () => adjustBet(betInput, 10));
    
    spinBtn.addEventListener("click", () => spinSlot(gameModal, reels, symbols));
}

function adjustBet(betInput, change) {
    let value = parseInt(betInput.value, 10);
    value = Math.max(10, Math.min(1000, value + change));
    betInput.value = value;
}

function spinSlot(gameModal, reels, symbols) {
    const spinBtn = gameModal.querySelector("#spin-slot-btn");
    const winDisplay = gameModal.querySelector("#win-amount");
    const betInput = gameModal.querySelector("#slot-bet-value");
    
    const betAmount = parseInt(betInput.value, 10);
    const currentCredits = parseInt(document.getElementById("credits").textContent.match(/\d+/)[0], 10);
    
    if (betAmount > currentCredits) {
        showNotification("Недостаточно кредитов для ставки", "error");
        return;
    }
    
    updateCredits(-betAmount);
    winDisplay.textContent = "0";
    spinBtn.disabled = true;
    spinBtn.textContent = "ВРАЩЕНИЕ...";
    
    const results = [];
    
    reels.forEach((reel, index) => {
        reel.innerHTML = "";
        reel.style.animation = `spin-reel ${1 + index * 0.5}s ease-out`;
        
        const result = Math.floor(Math.random() * symbols.length);
        results.push(result);
        
        for (let i = 0; i < 3; i++) {
            const symbolEl = document.createElement("div");
            symbolEl.className = "slot-symbol";
            symbolEl.textContent = symbols[(result + i) % symbols.length];
            reel.appendChild(symbolEl);
        }
    });
    
    setTimeout(() => {
        reels.forEach(reel => {
            reel.style.animation = "none";
        });
        
        const win = calculateWin(results, betAmount);
        winDisplay.textContent = win;
        
        if (win > 0) {
            updateCredits(win);
            showNotification(`Поздравляем! Вы выиграли ${win} кредитов!`, "success");
        }
        
        spinBtn.disabled = false;
        spinBtn.textContent = "СПИН!";
        
        updateGamesPlayed();
    }, 3000);
}

function calculateWin(results, betAmount) {
    if (results[0] === results[1] && results[1] === results[2]) {
        switch (results[0]) {
            case 0: return betAmount * 3;
            case 1: return betAmount * 5;
            case 2: return betAmount * 8;
            case 3: return betAmount * 10;
            case 4: return betAmount * 50;
        }
    }
    return 0;
}

function updateGamesPlayed() {
    const userData = getUserData();
    if (userData.username) {
        userData.gamesPlayed = (userData.gamesPlayed || 0) + 1;
        localStorage.setItem("allcashUserData", JSON.stringify(userData));
    }
}

window.showSlotsSection = showSlotsSection;