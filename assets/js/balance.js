// balance.js
// Функция для отображения баланса
function showBalanceSection() {
    const mainContent = document.querySelector(".main-content");
    
    // Сначала скрываем все основные элементы на странице
    const welcomeBanner = document.querySelector('.welcome-banner');
    if (welcomeBanner) welcomeBanner.style.display = 'none';
    
    const contentSections = document.querySelectorAll('.content-section:not(#balance-section)');
    contentSections.forEach(section => {
        section.style.display = 'none';
    });
    
    let balanceSection = document.getElementById("balance-section");
    
    if (!balanceSection) {
        // Получаем данные пользователя или используем значения по умолчанию
        const userData = getUserData();
        const username = userData.username || "Гость";
        const credits = userData.credits || 1000;
        const registered = userData.registered 
            ? new Date(userData.registered).toLocaleDateString() 
            : "Не зарегистрирован";
        const gamesPlayed = userData.gamesPlayed || 0;
        
        balanceSection = document.createElement("div");
        balanceSection.id = "balance-section";
        balanceSection.className = "content-section";
        
        balanceSection.innerHTML = `
            <div class="section-header">
                <div class="section-title">
                    <img src="assets/images/icons/balance.png" alt="Balance" class="section-icon">
                    Баланс и профиль
                </div>
            </div>
            <div class="profile-container">
                <div class="profile-info">
                    <div class="profile-avatar">
                        <img src="assets/images/avatar1.jfif" alt="Avatar" class="avatar-image">
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
        
        const depositBtn = balanceSection.querySelector(".deposit-btn");
        const withdrawBtn = balanceSection.querySelector(".withdraw-btn");
        
        depositBtn.addEventListener("click", showDepositModal);
        withdrawBtn.addEventListener("click", showWithdrawModal);
    } else {
        balanceSection.style.display = "block";
    }
}

// Вспомогательные функции
function getUserData() {
    // Получаем данные пользователя из localStorage или возвращаем значения по умолчанию
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
        return JSON.parse(userDataString);
    }
    return {
        username: "Гость",
        credits: 1000,
        registered: null,
        gamesPlayed: 0
    };
}

function updateCredits(amount) {
    // Обновляем баланс кредитов
    const userData = getUserData();
    userData.credits = (userData.credits || 1000) + amount;
    
    // Обновляем отображение в хедере
    const creditsElement = document.getElementById("credits");
    if (creditsElement) {
        creditsElement.textContent = `💰 ${userData.credits} кредитов`;
    }
    
    // Обновляем отображение на странице баланса
    const balanceAmount = document.querySelector(".balance-amount");
    if (balanceAmount) {
        balanceAmount.textContent = `💰 ${userData.credits} кредитов`;
    }
    
    // Сохраняем обновленные данные
    localStorage.setItem('userData', JSON.stringify(userData));
    
    return userData.credits;
}

function showNotification(message, type = "info") {
    // Создаем элемент уведомления
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Добавляем уведомление в DOM
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.add("visible");
    }, 10);
    
    // Автоматическое удаление через 3 секунды
    setTimeout(() => {
        notification.classList.remove("visible");
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300); // Время для анимации исчезновения
    }, 3000);
}

function showDepositModal() {
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
    
    const closeBtn = depositModal.querySelector(".close-btn");
    closeBtn.addEventListener("click", () => document.body.removeChild(depositModal));
    
    depositModal.addEventListener("click", (e) => {
        if (e.target === depositModal) {
            document.body.removeChild(depositModal);
        }
    });
    
    const depositForm = depositModal.querySelector("#depositForm");
    depositForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const amount = parseInt(depositForm.amount.value, 10);
        
        setTimeout(() => {
            updateCredits(amount);
            showNotification(`Баланс успешно пополнен на ${amount} кредитов`, "success");
            document.body.removeChild(depositModal);
            
            addTransaction("deposit", amount);
        }, 1000);
    });
}

function showWithdrawModal() {
    const userData = getUserData();
    const currentCredits = userData.credits || 1000;
    
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
                </select>
                
                <button type="submit">Вывести</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(withdrawModal);
    withdrawModal.style.display = "flex";
    
    const closeBtn = withdrawModal.querySelector(".close-btn");
    closeBtn.addEventListener("click", () => document.body.removeChild(withdrawModal));
    
    withdrawModal.addEventListener("click", (e) => {
        if (e.target === withdrawModal) {
            document.body.removeChild(withdrawModal);
        }
    });
    
    const withdrawForm = withdrawModal.querySelector("#withdrawForm");
    withdrawForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const amount = parseInt(withdrawForm.withdrawAmount.value, 10);
        
        if (amount > currentCredits) {
            showNotification("Недостаточно средств", "error");
            return;
        }
        
        setTimeout(() => {
            updateCredits(-amount);
            showNotification(`Выведено ${amount} кредитов`, "success");
            document.body.removeChild(withdrawModal);
            
            addTransaction("withdraw", amount);
        }, 1000);
    });
}

function addTransaction(type, amount) {
    const transactionsContainer = document.querySelector(".transactions");
    const noTransactionsElement = transactionsContainer.querySelector(".no-transactions");
    
    if (noTransactionsElement) {
        transactionsContainer.innerHTML = "";
    }
    
    const transactionElement = document.createElement("div");
    transactionElement.className = `transaction ${type}`;
    transactionElement.innerHTML = `
        <span class="transaction-date">${new Date().toLocaleString()}</span>
        <span class="transaction-type">${type === 'deposit' ? 'Пополнение' : 'Вывод'}</span>
        <span class="transaction-amount">${amount} кредитов</span>
    `;
    
    transactionsContainer.insertBefore(transactionElement, transactionsContainer.firstChild);
    
    // Сохраняем транзакцию в локальное хранилище
    saveTransaction(type, amount);
}

function saveTransaction(type, amount) {
    const transactions = getTransactions();
    transactions.push({
        date: new Date().toISOString(),
        type: type,
        amount: amount
    });
    
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function getTransactions() {
    const transactionsString = localStorage.getItem('transactions');
    if (transactionsString) {
        return JSON.parse(transactionsString);
    }
    return [];
}

// Экспортируем функции для использования в других файлах
window.showBalanceSection = showBalanceSection;
window.updateCredits = updateCredits;
window.showNotification = showNotification;
window.getUserData = getUserData;