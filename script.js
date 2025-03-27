document.addEventListener("DOMContentLoaded", () => {
    // Модальное окно регистрации
    const openRegisterBtn = document.getElementById("openRegister");
    const closeRegisterBtn = document.getElementById("closeRegister");
    const registerModal = document.getElementById("registerModal");
    const registerForm = document.getElementById("registerForm");
    const signupBtn = document.querySelector(".signup-btn");
	
	const wheel = document.getElementById("wheel");
    const spinButton = document.getElementById("spin");
    const numbersGroup = document.getElementById("numbers");
    let spinning = false;

    const numbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    const sectorAngle = 360 / numbers.length;

    // Открытие модального окна регистрации
    function openRegisterModal() {
        registerModal.style.display = "flex";
    }

    // Закрытие модального окна
    function closeRegisterModal() {
        registerModal.style.display = "none";
    }

    if (openRegisterBtn) {
        openRegisterBtn.addEventListener("click", openRegisterModal);
    }
    
    if (signupBtn) {
        signupBtn.addEventListener("click", openRegisterModal);
    }
    
    if (closeRegisterBtn) {
        closeRegisterBtn.addEventListener("click", closeRegisterModal);
    }

    // Закрытие при клике вне окна
    window.addEventListener("click", (e) => {
        if (e.target === registerModal) {
            closeRegisterModal();
        }
    });

    // Обработка регистрации
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const getBonus = document.getElementById("bonusCheckbox").checked;

            if (username && email && password) {
                // Обновляем UI после регистрации
                document.getElementById("openRegister").textContent = username;
                document.getElementById("openRegister").classList.add("logged-in");
                
                // Если пользователь выбрал бонус, добавляем кредиты
                if (getBonus) {
                    updateCredits(500);
                }
                
                // Закрываем модальное окно
                closeRegisterModal();
                
                // Сохраняем данные в localStorage
                saveUserData(username, email, getBonus);
                
                // Показываем уведомление об успешной регистрации
                showNotification("Регистрация успешна! Добро пожаловать, " + username);
            }
        });
    }
    
    // Функция для сохранения данных пользователя
    function saveUserData(username, email, hasBonus) {
        const userData = {
            username: username,
            email: email,
            credits: hasBonus ? 1500 : 1000,
            registered: new Date().toISOString(),
            gamesPlayed: 0,
            isLoggedIn: true
        };
        
        localStorage.setItem("allcashUserData", JSON.stringify(userData));
    }
    
    // Функция для обновления кредитов
    function updateCredits(amount) {
        const creditsElement = document.getElementById("credits");
        const currentCredits = parseInt(creditsElement.textContent.match(/\d+/)[0], 10);
        const newCredits = currentCredits + amount;
        
        creditsElement.textContent = `💰 ${newCredits} кредитов`;
        
        // Анимация изменения кредитов
        creditsElement.classList.add("credits-update");
        setTimeout(() => {
            creditsElement.classList.remove("credits-update");
        }, 1000);
        
        // Обновляем данные в localStorage
        const userData = JSON.parse(localStorage.getItem("allcashUserData") || "{}");
        if (userData.username) {
            userData.credits = newCredits;
            localStorage.setItem("allcashUserData", JSON.stringify(userData));
        }
        
        return newCredits;
    }
    
    // Функция для отображения уведомления
    function showNotification(message, type = "success") {
        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.classList.add("show");
        }, 10);
        
        // Удаление уведомления через 3 секунды
        setTimeout(() => {
            notification.classList.remove("show");
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Навигация по пунктам меню
    const navItems = document.querySelectorAll("nav a");
    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            
            // Удаляем класс active у всех элементов
            navItems.forEach(navItem => navItem.classList.remove("active"));
            
            // Добавляем класс active к выбранному элементу
            item.classList.add("active");
            
            // Показываем соответствующий контент
            showContent(item.id);
        });
    });
    
    // Функция для отображения различных секций контента
    function showContent(contentId) {
        // Здесь можно реализовать переключение между различными разделами сайта
        // Например, скрывать/показывать различные .content-section
        
        const contentSections = document.querySelectorAll(".content-section");
        
        switch (contentId) {
            case "homeBtn":
                contentSections.forEach(section => section.style.display = "block");
                document.querySelector(".welcome-banner").style.display = "flex";
                break;
            case "slotsBtn":
                contentSections.forEach(section => section.style.display = "none");
                document.querySelector(".welcome-banner").style.display = "none";
                
                // Создаем и отображаем секцию со слотами
                showSlotsSection();
                break;
            case "rouletteBtn":
                contentSections.forEach(section => section.style.display = "none");
                document.querySelector(".welcome-banner").style.display = "none";
                
                // Создаем и отображаем секцию с рулеткой
                showRouletteSection();
                break;
            case "balanceBtn":
                contentSections.forEach(section => section.style.display = "none");
                document.querySelector(".welcome-banner").style.display = "none";
                
                // Создаем и отображаем секцию с балансом
                showBalanceSection();
                break;
            case "bonusBtn":
                contentSections.forEach(section => section.style.display = "none");
                document.querySelector(".welcome-banner").style.display = "none";
                
                // Показываем только секцию с бонусами
                contentSections.forEach(section => {
                    if (section.querySelector(".section-title").textContent.includes("Bonuses")) {
                        section.style.display = "block";
                    }
                });
                break;
        }
    }
    
    // Функция для отображения секции со слотами
    function showSlotsSection() {
        const mainContent = document.querySelector(".main-content");
        
        // Проверяем, существует ли уже секция со слотами
        let slotsSection = document.getElementById("slots-section");
        
        if (!slotsSection) {
            // Создаем новую секцию со слотами
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
            
            // Добавляем обработчики для кнопок игры
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
    
    // Функция для отображения секции с рулеткой
    function showRouletteSection() {
        const mainContent = document.querySelector(".main-content");
        
        // Проверяем, существует ли уже секция с рулеткой
        let rouletteSection = document.getElementById("roulette-section");
        
        if (!rouletteSection) {
            // Создаем новую секцию с рулеткой
            rouletteSection = document.createElement("div");
            rouletteSection.id = "roulette-section";
            rouletteSection.className = "content-section";
            
            rouletteSection.innerHTML = `
                <div class="section-header">
                    <div class="section-title">
                        <img src="/api/placeholder/24/24" alt="Roulette" class="section-icon">
                        Рулетка
                    </div>
                </div>
                <div class="roulette-container">
                    <div class="roulette-wheel">
                        <img src="/api/placeholder/300/300" alt="Roulette Wheel" class="wheel-image">
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
                            <div class="history-numbers">
                                <!-- История будет добавлена через JavaScript -->
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            mainContent.appendChild(rouletteSection);
            
            // Добавляем обработчики для кнопок рулетки
            initializeRouletteControls();
        } else {
            rouletteSection.style.display = "block";
        }
    }
    
    // Функция для инициализации элементов управления рулеткой
    function initializeRouletteControls() {
        const minusBtn = document.querySelector(".bet-btn.minus");
        const plusBtn = document.querySelector(".bet-btn.plus");
        const betInput = document.getElementById("bet-value");
        const spinBtn = document.getElementById("spin-btn");
        const betTypeButtons = document.querySelectorAll(".bet-type-btn");
        
        // Устанавливаем активный тип ставки по умолчанию
        let activeBetType = "red";
        betTypeButtons[0].classList.add("active");
        
        // Обработчики для кнопок + и -
        minusBtn.addEventListener("click", () => {
            let value = parseInt(betInput.value, 10);
            if (value > 10) {
                value -= 10;
                betInput.value = value;
            }
        });
        
        plusBtn.addEventListener("click", () => {
            let value = parseInt(betInput.value, 10);
            if (value < 1000) {
                value += 10;
                betInput.value = value;
            }
        });
        
        // Обработчики для кнопок типа ставки
        betTypeButtons.forEach(button => {
            button.addEventListener("click", () => {
                betTypeButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
                activeBetType = button.getAttribute("data-type");
            });
        });
        
        // Обработчик для кнопки вращения
        spinBtn.addEventListener("click", () => {
            const betAmount = parseInt(betInput.value, 10);
            
            // Проверяем, есть ли у пользователя достаточно кредитов
            const currentCredits = parseInt(document.getElementById("credits").textContent.match(/\d+/)[0], 10);
            
            if (betAmount > currentCredits) {
                showNotification("Недостаточно кредитов для ставки", "error");
                return;
            }
            
            // Снимаем ставку с баланса
            updateCredits(-betAmount);
            
            // Запускаем анимацию вращения
            spinRoulette(activeBetType, betAmount);
        });
    }
    
    // Функция для вращения рулетки
    function spinRoulette(betType, betAmount) {
        const wheel = document.querySelector(".wheel-image");
        const spinBtn = document.getElementById("spin-btn");
        
        // Отключаем кнопку во время вращения
        spinBtn.disabled = true;
        spinBtn.textContent = "ВРАЩЕНИЕ...";
        
        // Генерируем случайный результат
        const result = Math.floor(Math.random() * 37); // 0-36
        let resultType;
        
        if (result === 0) {
            resultType = "green";
        } else if (result % 2 === 0) {
            resultType = "black";
        } else {
            resultType = "red";
        }
        
        // Применяем анимацию вращения
        wheel.style.animation = "none";
        setTimeout(() => {
            wheel.style.animation = "spin 3s ease-out forwards";
        }, 10);
        
        // Через 3 секунды показываем результат
        setTimeout(() => {
            // Обновляем историю
            updateRouletteHistory(result, resultType);
            
            // Проверяем выигрыш
            if (betType === resultType) {
                let winAmount;
                if (betType === "green") {
                    winAmount = betAmount * 35;
                } else {
                    winAmount = betAmount * 2;
                }
                
                updateCredits(winAmount);
                showNotification(`Поздравляем! Вы выиграли ${winAmount} кредитов!`, "success");
            } else {
                showNotification(`К сожалению, вы проиграли. Выпало: ${resultType} ${result}`, "error");
            }
            
            // Включаем кнопку снова
            spinBtn.disabled = false;
            spinBtn.textContent = "ВРАЩАТЬ РУЛЕТКУ";
            
        }, 3000);
    }
    
    // Функция для обновления истории рулетки
    function updateRouletteHistory(number, type) {
        const historyContainer = document.querySelector(".history-numbers");
        
        // Создаем элемент истории
        const historyItem = document.createElement("div");
        historyItem.className = `history-item ${type}`;
        historyItem.textContent = number;
        
        // Добавляем в начало истории
        historyContainer.prepend(historyItem);
        
        // Ограничиваем количество элементов истории
        if (historyContainer.children.length > 10) {
            historyContainer.removeChild(historyContainer.lastChild);
        }
    }
	

    
    // Функция для отображения секции с балансом
    function showBalanceSection() {
        const mainContent = document.querySelector(".main-content");
        
        // Проверяем, существует ли уже секция с балансом
        let balanceSection = document.getElementById("balance-section");
        
        if (!balanceSection) {
            // Получаем данные пользователя
            const userData = JSON.parse(localStorage.getItem("allcashUserData") || "{}");
            const username = userData.username || "Гость";
            const credits = userData.credits || 1000;
            const registered = userData.registered ? new Date(userData.registered).toLocaleDateString() : "Не зарегистрирован";
            const gamesPlayed = userData.gamesPlayed || 0;
            
            // Создаем новую секцию с балансом
            balanceSection = document.createElement("div");
            balanceSection.id = "balance-section";
            balanceSection.className = "content-section";
            
            balanceSection.innerHTML = `
                <div class="section-header">
                    <div class="section-title">
                        <img src="/api/placeholder/24/24" alt="Balance" class="section-icon">
                        Баланс и профиль
                    </div>
                </div>
                <div class="profile-container">
                    <div class="profile-info">
                        <div class="profile-avatar">
                            <img src="/api/placeholder/100/100" alt="Avatar" class="avatar-image">
                        </div>
                        <div class="profile-details">
                            <h2>${username}</h2>
                            <p>Зарегистрирован: ${registered}</p>
                            <p>Сыграно игр: ${gamesPlayed}</p>
                        </div>
                    </div>
                    <div class="profile-balance">
                        <h3>Баланс</h3>
                        <div class="balance-amount">💰 ${credits} кредитов</div>
                        <button class="deposit-btn">Пополнить баланс</button>
                        <button class="withdraw-btn">Вывести средства</button>
                    </div>
                    <div class="transaction-history">
                        <h3>История транзакций</h3>
                        <div class="transactions">
                            <div class="no-transactions">История транзакций пуста</div>
                        </div>
                    </div>
                </div>
            `;
            
            mainContent.appendChild(balanceSection);
            
            // Добавляем обработчики для кнопок
            const depositBtn = balanceSection.querySelector(".deposit-btn");
            const withdrawBtn = balanceSection.querySelector(".withdraw-btn");
            
            depositBtn.addEventListener("click", () => {
                showDepositModal();
            });
            
            withdrawBtn.addEventListener("click", () => {
                showWithdrawModal();
            });
        } else {
            balanceSection.style.display = "block";
        }
    }
    
    // Функция для показа модального окна пополнения баланса
    function showDepositModal() {
        // Создаем модальное окно
        const depositModal = document.createElement("div");
        depositModal.className = "modal";
        depositModal.id = "depositModal";
        
        depositModal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <h2>Пополнение баланса</h2>
                <form id="depositForm">
                    <label for="amount">Сумма (кредиты):</label>
                    <input type="number" id="amount" placeholder="Введите сумму" min="100" max="10000" required>
                    
                    <label for="paymentMethod">Способ оплаты:</label>
                    <select id="paymentMethod" required>
                        <option value="">Выберите способ оплаты</option>
                        <option value="card">Банковская карта</option>
                        <option value="qiwi">QIWI</option>
                        <option value="webmoney">WebMoney</option>
                        <option value="crypto">Криптовалюта</option>
                    </select>
                    
                    <button type="submit">Пополнить</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(depositModal);
        depositModal.style.display = "flex";
        
        // Обработчик закрытия
        const closeBtn = depositModal.querySelector(".close-btn");
        closeBtn.addEventListener("click", () => {
            document.body.removeChild(depositModal);
        });
        
        // Закрытие при клике вне окна
        depositModal.addEventListener("click", (e) => {
            if (e.target === depositModal) {
                document.body.removeChild(depositModal);
            }
        });
        
        // Обработчик формы
        const depositForm = depositModal.querySelector("#depositForm");
        depositForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const amount = parseInt(depositForm.amount.value, 10);
            
            // Имитация успешного пополнения
            setTimeout(() => {
                updateCredits(amount);
                showNotification(`Баланс успешно пополнен на ${amount} кредитов`, "success");
                document.body.removeChild(depositModal);
                
                // Обновляем историю транзакций
                addTransaction("deposit", amount);
            }, 1000);
        });
    }
    
    // Функция для показа модального окна вывода средств
    function showWithdrawModal() {
        // Получаем текущий баланс
        const currentCredits = parseInt(document.getElementById("credits").textContent.match(/\d+/)[0], 10);
        
        // Создаем модальное окно
        const withdrawModal = document.createElement("div");
        withdrawModal.className = "modal";
        withdrawModal.id = "withdrawModal";
        
        withdrawModal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <h2>Вывод средств</h2>
                <form id="withdrawForm">
                    <p>Доступно: ${currentCredits} кредитов</p>
                    
                    <label for="withdrawAmount">Сумма (кредиты):</label>
                    <input type="number" id="withdrawAmount" placeholder="Введите сумму" min="100" max="${currentCredits}" required>
                    
                    <label for="withdrawMethod">Способ вывода:</label>
                    <select id="withdrawMethod" required>
                        <option value="">Выберите способ вывода</option>
                        <option value="card">Банковская карта</option>
                        <option value="qiwi">QIWI</option>
                        <option value="webmoney">WebMoney</option>
                        <option value="crypto">Криптовалюта</option>
                    </select>
                    
                    <label for="withdrawDetails">Реквизиты:</label>
                    <input type="text" id="withdrawDetails" placeholder="Введите реквизиты" required>
                    
                    <button type="submit">Вывести</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(withdrawModal);
        withdrawModal.style.display = "flex";
        
        // Обработчик закрытия
        const closeBtn = withdrawModal.querySelector(".close-btn");
        closeBtn.addEventListener("click", () => {
            document.body.removeChild(withdrawModal);
        });
        
        // Закрытие при клике вне окна
        withdrawModal.addEventListener("click", (e) => {
            if (e.target === withdrawModal) {
                document.body.removeChild(withdrawModal);
            }
        });
        
        // Обработчик формы
        const withdrawForm = withdrawModal.querySelector("#withdrawForm");
        withdrawForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const amount = parseInt(withdrawForm.withdrawAmount.value, 10);
            
            // Проверяем, есть ли достаточно средств
            if (amount > currentCredits) {
                showNotification("Недостаточно средств для вывода", "error");
                return;
            }
            
            // Имитация успешного вывода
            setTimeout(() => {
                updateCredits(-amount);
                showNotification(`Запрос на вывод ${amount} кредитов успешно создан`, "success");
                document.body.removeChild(withdrawModal);
                
                // Обновляем историю транзакций
                addTransaction("withdraw", amount);
            }, 1000);
        });
    }
    
    // Функция для добавления транзакции в историю
    function addTransaction(type, amount) {
        const transactionsContainer = document.querySelector(".transactions");
        
        // Удаляем сообщение о пустой истории
        const noTransactions = transactionsContainer.querySelector(".no-transactions");
        if (noTransactions) {
            transactionsContainer.removeChild(noTransactions);
        }
        
        // Создаем элемент транзакции
        const transaction = document.createElement("div");
        transaction.className = `transaction ${type}`;
        
        const date = new Date().toLocaleString();
        const typeText = type === "deposit" ? "Пополнение" : "Вывод";
        const amountText = type === "deposit" ? `+${amount}` : `-${amount}`;
        
        transaction.innerHTML = `
            <div class="transaction-date">${date}</div>
            <div class="transaction-type">${typeText}</div>
            <div class="transaction-amount">${amountText}</div>
        `;
        
        // Добавляем в начало истории
        transactionsContainer.prepend(transaction);
    }
    
    // Функция для запуска игры
    function startGame(gameId) {
        // Здесь можно реализовать запуск различных игр
        // в зависимости от переданного gameId
        
        // Проверяем авторизацию
        const userData = JSON.parse(localStorage.getItem("allcashUserData") || "{}");
        if (!userData.username) {
            showNotification("Для игры необходимо зарегистрироваться", "error");
            openRegisterModal();
            return;
        }
        
        // Создаем модальное окно с игрой
        const gameModal = document.createElement("div");
        gameModal.className = "modal";
        gameModal.id = `${gameId}Modal`;
        
        let gameTitle = "";
        let gameContent = "";
        
        switch (gameId) {
            case "slot1":
                gameTitle = "FRUIT SPIN";
                gameContent = createSlotGameContent();
                break;
            case "slot2":
                gameTitle = "LUCKY 7";
                gameContent = createSlotGameContent();
                break;
            case "slot3":
                gameTitle = "MEGA FORTUNE";
                gameContent = createSlotGameContent();
                break;
            case "slot4":
                gameTitle = "SPACE ADVENTURE";
                gameContent = createSlotGameContent();
                break;
            default:
                gameTitle = "Game";
                gameContent = "<p>Эта игра в разработке</p>";
        }
        
        gameModal.innerHTML = `
            <div class="modal-content game-modal-content">
                <span class="close-btn">&times;</span>
                <h2>${gameTitle}</h2>
                ${gameContent}
            </div>
        `;
        
        document.body.appendChild(gameModal);
        gameModal.style.display = "flex";
        
        // Обработчик закрытия
        const closeBtn = gameModal.querySelector(".close-btn");
        closeBtn.addEventListener("click", () => {
            document.body.removeChild(gameModal);
        });
        
        // Закрытие при клике вне окна
        gameModal.addEventListener("click", (e) => {
            if (e.target === gameModal) {
                document.body.removeChild(gameModal);
            }
        });
        
        // Инициализируем игру, если это слот
        if (gameId.startsWith("slot")) {
            initializeSlotGame(gameModal);
        }
    }
    
    // Функция для создания содержимого слота
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
    
    // Функция для инициализации игры в слот
    function initializeSlotGame(gameModal) {
        const reels = [
            document.getElementById("reel1"),
            document.getElementById("reel2"),
            document.getElementById("reel3")
        ];
        
        // Символы для слота
        const symbols = ["🍒", "🍋", "🍊", "🍇", "7️⃣"];
        
        // Заполняем барабаны случайными символами
        reels.forEach(reel => {
            for (let i = 0; i < 3; i++) {
                const symbolEl = document.createElement("div");
                symbolEl.className = "slot-symbol";
                symbolEl.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                reel.appendChild(symbolEl);
            }
        });
        
        // Кнопки управления ставкой
        const minusBtn = gameModal.querySelector(".bet-btn.minus");
        const plusBtn = gameModal.querySelector(".bet-btn.plus");
        const betInput = gameModal.querySelector("#slot-bet-value");
        const spinBtn = gameModal.querySelector("#spin-slot-btn");
        
        // Обработчики для кнопок + и -
        minusBtn.addEventListener("click", () => {
            let value = parseInt(betInput.value, 10);
            if (value > 10) {
                value -= 10;
                betInput.value = value;
            }
        });
        
        plusBtn.addEventListener("click", () => {
            let value = parseInt(betInput.value, 10);
            if (value < 1000) {
                value += 10;
                betInput.value = value;
            }
        });
        
        // Обработчик для кнопки спина
        spinBtn.addEventListener("click", () => {
            const betAmount = parseInt(betInput.value, 10);
            
            // Проверяем, есть ли у пользователя достаточно кредитов
            const currentCredits = parseInt(document.getElementById("credits").textContent.match(/\d+/)[0], 10);
            
            if (betAmount > currentCredits) {
                showNotification("Недостаточно кредитов для ставки", "error");
                return;
            }
            
            // Снимаем ставку с баланса
            updateCredits(-betAmount);
            
            // Запускаем вращение слота
            spinSlot(reels, symbols, betAmount);
        });
    }
    
    // Функция для вращения слота
    function spinSlot(reels, symbols, betAmount) {
        const spinBtn = document.getElementById("spin-slot-btn");
        const winDisplay = document.getElementById("win-amount");
        
        // Отключаем кнопку во время вращения
        spinBtn.disabled = true;
        spinBtn.textContent = "ВРАЩЕНИЕ...";
        winDisplay.textContent = "0";
        
        // Генерируем результаты для каждого барабана
        const results = [];
        
        // Анимация вращения
        reels.forEach((reel, index) => {
            // Очищаем барабан
            reel.innerHTML = "";
            
            // Создаем анимацию
            reel.style.animation = `spin-reel ${1 + index * 0.5}s ease-out`;
            
            // Генерируем случайный результат для барабана
            const result = Math.floor(Math.random() * symbols.length);
            results.push(result);
            
            // Заполняем барабан символами
            for (let i = 0; i < 3; i++) {
                const symbolEl = document.createElement("div");
                symbolEl.className = "slot-symbol";
                symbolEl.textContent = symbols[(result + i) % symbols.length];
                reel.appendChild(symbolEl);
            }
        });
        
        // Проверяем выигрыш через 3 секунды
        setTimeout(() => {
            // Сбрасываем анимацию
            reels.forEach(reel => {
                reel.style.animation = "none";
            });
            
            // Проверяем выигрыш
            let win = 0;
            
            // Если все символы одинаковые
            if (results[0] === results[1] && results[1] === results[2]) {
                switch (results[0]) {
                    case 0: // 🍒
                        win = betAmount * 3;
                        break;
                    case 1: // 🍋
                        win = betAmount * 5;
                        break;
                    case 2: // 🍊
                        win = betAmount * 8;
                        break;
                    case 3: // 🍇
                        win = betAmount * 10;
                        break;
                    case 4: // 7️⃣
                        win = betAmount * 50;
                        break;
                }
            }
            
            // Обновляем отображение выигрыша
            winDisplay.textContent = win;
            
            // Если выигрыш, добавляем на баланс
            if (win > 0) {
                updateCredits(win);
                showNotification(`Поздравляем! Вы выиграли ${win} кредитов!`, "success");
            }
            
            // Включаем кнопку снова
            spinBtn.disabled = false;
            spinBtn.textContent = "СПИН!";
            
            // Обновляем количество сыгранных игр
            const userData = JSON.parse(localStorage.getItem("allcashUserData") || "{}");
            if (userData.username) {
                userData.gamesPlayed = (userData.gamesPlayed || 0) + 1;
                localStorage.setItem("allcashUserData", JSON.stringify(userData));
            }
            
        }, 3000);
    }
    
    // Проверка наличия сохраненных данных пользователя при загрузке
    const savedUserData = JSON.parse(localStorage.getItem("allcashUserData") || "{}");
    if (savedUserData.username && savedUserData.isLoggedIn) {
        // Если пользователь уже залогинен, обновляем UI
        document.getElementById("openRegister").textContent = savedUserData.username;
        document.getElementById("openRegister").classList.add("logged-in");
        
        // Обновляем отображение кредитов
        const creditsElement = document.getElementById("credits");
        creditsElement.textContent = `💰 ${savedUserData.credits} кредитов`;
    }
});