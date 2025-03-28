// balance.js
import { showNotification } from './utils.js';
import { updateCredits } from './utils.js';
import { getUserData } from './utils.js';

export function showBalanceSection() {
    const mainContent = document.querySelector(".main-content");
    
    let balanceSection = document.getElementById("balance-section");
    
    if (!balanceSection) {
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
                    <div id="credits" class="balance-amount">💰 ${credits} кредитов</div>
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
    const creditsElement = document.getElementById("credits");
    const currentCredits = parseInt(creditsElement.textContent.match(/\d+/)[0], 10);
    
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
}

export function updateBalanceDisplay(newBalance) {
    const creditsElement = document.getElementById("credits");
    if (creditsElement) {
        creditsElement.textContent = `💰 ${newBalance} кредитов`;
    }
}
