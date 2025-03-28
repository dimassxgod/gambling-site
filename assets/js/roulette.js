function showRouletteSection() {
    const mainContent = document.querySelector(".main-content");
    
    let rouletteSection = document.getElementById("roulette-section");
    
    if (!rouletteSection) {
        rouletteSection = document.createElement("div");
        rouletteSection.id = "roulette-section";
        rouletteSection.className = "content-section";
        
        rouletteSection.innerHTML = `
            <div class="section-header">
                <div class="section-title">
                    <img src="assets/images/icons/roulette.png" alt="Roulette" class="section-icon">
                    Рулетка
                </div>
            </div>
            <div class="roulette-container">
                <div class="roulette-wheel">
                    <img src="assets/images/roulette.png" alt="Roulette Wheel" class="wheel-image">
                </div>
                <div class="roulette-controls">
                    <div class="bet-controls">
                        <h3>Сделайте ставку</h3>
                        <div class="bet-amount">
                            <button class="bet-btn minus">-</button>
                            <input type="number" id="bet-value" value="50" min="10" max="1000">
                            <button class="bet-btn plus">+</button>
                        </div>
                        <div class="bet-type">
                            <button class="bet-type-btn" data-type="red">Красное</button>
                            <button class="bet-type-btn" data-type="black">Черное</button>
                            <button class="bet-type-btn" data-type="green">Зеленое</button>
                        </div>
                    </div>
                    <button id="spin-btn" class="spin-button">ВРАЩАТЬ РУЛЕТКУ</button>
                    <div class="roulette-history">
                        <h3>История</h3>
                        <div class="history-numbers"></div>
                    </div>
                </div>
            </div>
        `;
        
        mainContent.appendChild(rouletteSection);
        initializeRouletteControls();
    } else {
        rouletteSection.style.display = "block";
    }
}

function initializeRouletteControls() {
    const minusBtn = document.querySelector(".bet-btn.minus");
    const plusBtn = document.querySelector(".bet-btn.plus");
    const betInput = document.getElementById("bet-value");
    const spinBtn = document.getElementById("spin-btn");
    const betTypeButtons = document.querySelectorAll(".bet-type-btn");
    
    let activeBetType = "red";
    betTypeButtons[0].classList.add("active");
    
    minusBtn.addEventListener("click", () => adjustBet(betInput, -10));
    plusBtn.addEventListener("click", () => adjustBet(betInput, 10));
    
    betTypeButtons.forEach(button => {
        button.addEventListener("click", () => {
            betTypeButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            activeBetType = button.getAttribute("data-type");
        });
    });
    
    spinBtn.addEventListener("click", () => spinRoulette(betInput, activeBetType));
}

function adjustBet(betInput, change) {
    let value = parseInt(betInput.value, 10);
    value = Math.max(10, Math.min(1000, value + change));
    betInput.value = value;
}

function spinRoulette(betInput, activeBetType) {
    const betAmount = parseInt(betInput.value, 10);
    const currentCredits = parseInt(document.getElementById("credits").textContent.match(/\d+/)[0], 10);
    
    if (betAmount > currentCredits) {
        showNotification("Недостаточно кредитов для ставки", "error");
        return;
    }
    
    updateCredits(-betAmount);
    
    const wheel = document.querySelector(".wheel-image");
    const spinBtn = document.getElementById("spin-btn");
    
    spinBtn.disabled = true;
    spinBtn.textContent = "ВРАЩЕНИЕ...";
    
    const result = Math.floor(Math.random() * 37);
    let resultType;
    
    if (result === 0) {
        resultType = "green";
    } else if (result % 2 === 0) {
        resultType = "black";
    } else {
        resultType = "red";
    }
    
    wheel.style.animation = "none";
    setTimeout(() => {
        wheel.style.animation = "spin 3s ease-out forwards";
    }, 10);
    
    setTimeout(() => {
        updateRouletteHistory(result, resultType);
        
        if (activeBetType === resultType) {
            let winAmount = activeBetType === "green" ? betAmount * 35 : betAmount * 2;
            updateCredits(winAmount);
            showNotification(`Поздравляем! Вы выиграли ${winAmount} кредитов!`, "success");
        } else {
            showNotification(`К сожалению, вы проиграли. Выпало: ${resultType} ${result}`, "error");
        }
        
        spinBtn.disabled = false;
        spinBtn.textContent = "ВРАЩАТЬ РУЛЕТКУ";
    }, 3000);
}

function updateRouletteHistory(number, type) {
    const historyContainer = document.querySelector(".history-numbers");
    
    const historyItem = document.createElement("div");
    historyItem.className = `history-item ${type}`;
    historyItem.textContent = number;
    
    historyContainer.prepend(historyItem);
    
    if (historyContainer.children.length > 10) {
        historyContainer.removeChild(historyContainer.lastChild);
    }
}

function showNotification(message, type) {
    const notificationContainer = document.createElement('div');
    notificationContainer.className = `notification ${type}`;
    notificationContainer.textContent = message;
    
    document.body.appendChild(notificationContainer);
    
    setTimeout(() => {
        notificationContainer.remove();
    }, 3000);
}

function updateCredits(amount) {
    const creditsElement = document.getElementById("credits");
    const currentCredits = parseInt(creditsElement.textContent.match(/\d+/)[0], 10);
    const newCredits = currentCredits + amount;
    
    creditsElement.textContent = `💰 ${newCredits} кредитов`;
}