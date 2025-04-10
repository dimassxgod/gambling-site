// auth.js - версия без модулей

// Объявляем глобальные функции, которые раньше были импортированы из utils.js
function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function saveUserData(userData) {
    localStorage.setItem("allcashUserData", JSON.stringify(userData));
}

function updateCredits(amount) {
    const creditsElement = document.getElementById("credits");
    if (creditsElement) {
        const current = parseInt(creditsElement.textContent.match(/\d+/)[0], 10);
        const newAmount = current + amount;
        creditsElement.textContent = `💰 ${newAmount} кредитов`;
        
        // Обновляем данные в localStorage
        const userData = JSON.parse(localStorage.getItem("allcashUserData") || "{}");
        if (userData.username) {
            userData.credits = newAmount;
            saveUserData(userData);
        }
    }
}

function getUserData() {
    return JSON.parse(localStorage.getItem("allcashUserData") || "{}");
}

// Основные функции аутентификации
function initializeAuth() {
    const openRegisterBtn = document.getElementById("openRegister");
    const closeRegisterBtn = document.getElementById("closeRegister");
    const registerModal = document.getElementById("registerModal");
    const registerForm = document.getElementById("registerForm");
    const signupBtn = document.querySelector(".signup-btn");
    const loginContainer = document.getElementById("loginContainer");
    const userPanel = document.getElementById("userPanel");

    const openLoginBtn = document.getElementById("openLogin");
    const closeLoginBtn = document.getElementById("closeLogin");
    const loginModal = document.getElementById("loginModal");
    const switchToRegisterLink = document.getElementById("switchToRegister");
    const switchToLoginLink = document.getElementById("switchToLogin");

    // Функция для закрытия всех модальных окон
    function closeAllModals() {
        if (registerModal) registerModal.style.display = "none";
        if (loginModal) loginModal.style.display = "none";
    }

    function openLoginModal() {
        closeAllModals();
        if (loginModal) loginModal.style.display = "flex";
    }

    function closeLoginModal() {
        if (loginModal) loginModal.style.display = "none";
    }

    function openRegisterModal() {
        closeAllModals();
        if (registerModal) registerModal.style.display = "flex";
    }

    function closeRegisterModal() {
        if (registerModal) registerModal.style.display = "none";
    }

    // Обновление интерфейса после входа
    function updateUIAfterLogin(username) {
        if (loginContainer) loginContainer.style.display = "none";
        if (userPanel) {
            userPanel.style.display = "flex";
            const usernameDisplay = document.getElementById("usernameDisplay");
            if (usernameDisplay) usernameDisplay.textContent = username;
        }
        if (openLoginBtn) openLoginBtn.disabled = true;
        if (openRegisterBtn) openRegisterBtn.disabled = true;
    }

    // Обработчики событий
    if (openLoginBtn) openLoginBtn.addEventListener("click", openLoginModal);
    if (closeLoginBtn) closeLoginBtn.addEventListener("click", closeLoginModal);
    if (openRegisterBtn) openRegisterBtn.addEventListener("click", openRegisterModal);
    if (signupBtn) signupBtn.addEventListener("click", openRegisterModal);
    if (closeRegisterBtn) closeRegisterBtn.addEventListener("click", closeRegisterModal);

    // Клик вне модального окна
    window.addEventListener("click", (e) => {
        if (e.target === loginModal) closeLoginModal();
        if (e.target === registerModal) closeRegisterModal();
    });

    // Переключение между формами
    if (switchToRegisterLink) {
        switchToRegisterLink.addEventListener("click", (e) => {
            e.preventDefault();
            closeAllModals();
            if (registerModal) registerModal.style.display = "flex";
        });
    }

    if (switchToLoginLink) {
        switchToLoginLink.addEventListener("click", (e) => {
            e.preventDefault();
            closeAllModals();
            if (loginModal) loginModal.style.display = "flex";
        });
    }

    // Обработка формы регистрации
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const getBonus = document.getElementById("bonusCheckbox").checked;

            if (username && email && password) {
                try {
                    const submitButton = registerForm.querySelector('button[type="submit"]');
                    if (submitButton) {
                        submitButton.disabled = true;
                        submitButton.innerHTML = 'Регистрация...';
                    }
                    
                    // Эмуляция запроса к серверу
                    const userData = {
                        id: Date.now(),
                        username,
                        email,
                        balance: 1000
                    };
                    
                    // Имитация задержки сети
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.innerHTML = 'Зарегистрироваться';
                    }
                    
                    // Обновляем UI
                    updateUIAfterLogin(userData.username);
                    
                    // Начисляем бонус если выбран
                    let credits = userData.balance;
                    if (getBonus) credits += 500;
                    
                    // Сохраняем данные
                    const userDataToSave = {
                        id: userData.id,
                        username: userData.username,
                        email: userData.email,
                        isLoggedIn: true,
                        credits: credits,
                        bonusReceived: getBonus
                    };
                    
                    saveUserData(userDataToSave);
                    
                    const creditsElement = document.getElementById("credits");
                    if (creditsElement) {
                        creditsElement.textContent = `💰 ${credits} кредитов`;
                    }
                    
                    closeAllModals();
                    showNotification("Регистрация успешна! Добро пожаловать, " + userData.username);
                } catch (error) {
                    console.error('Ошибка регистрации:', error);
                    showNotification("Ошибка: " + error.message, "error");
                }
            }
        });
    }
    
    // Инициализация функций выхода и входа
    initializeLogout();
    initializeLogin();
    
    // Проверяем авторизацию при загрузке
    checkUserLogin();
}

function initializeLogout() {
    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("allcashUserData");
            
            const loginContainer = document.getElementById("loginContainer");
            const userPanel = document.getElementById("userPanel");
            
            if (loginContainer) {
                loginContainer.style.display = "flex";
                const openLoginBtn = document.getElementById("openLogin");
                const openRegisterBtn = document.getElementById("openRegister");
                if (openLoginBtn) openLoginBtn.disabled = false;
                if (openRegisterBtn) openRegisterBtn.disabled = false;
            }
            
            if (userPanel) userPanel.style.display = "none";
            
            const creditsElement = document.getElementById("credits");
            if (creditsElement) {
                creditsElement.textContent = "💰 0 кредитов";
            }
            
            showNotification("Вы успешно вышли из системы");
        });
    }
}

function initializeLogin() {
    const loginForm = document.getElementById("loginForm");
    
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const username = document.getElementById("loginUsername").value;
            const password = document.getElementById("loginPassword").value;
            
            if (username && password) {
                try {
                    const submitButton = loginForm.querySelector('button[type="submit"]');
                    if (submitButton) {
                        submitButton.disabled = true;
                        submitButton.innerHTML = 'Вход...';
                    }
                    
                    // Эмуляция запроса к серверу
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    const userData = {
                        id: Date.now(),
                        username,
                        email: `${username}@example.com`,
                        balance: 1000
                    };
                    
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.innerHTML = 'Войти';
                    }
                    
                    // Обновляем UI
                    const loginContainer = document.getElementById("loginContainer");
                    const userPanel = document.getElementById("userPanel");
                    
                    if (loginContainer) loginContainer.style.display = "none";
                    if (userPanel) {
                        userPanel.style.display = "flex";
                        document.getElementById("usernameDisplay").textContent = userData.username;
                    }
                    
                    const openLoginBtn = document.getElementById("openLogin");
                    const openRegisterBtn = document.getElementById("openRegister");
                    if (openLoginBtn) openLoginBtn.disabled = true;
                    if (openRegisterBtn) openRegisterBtn.disabled = true;
                    
                    // Сохраняем данные
                    const userDataToSave = {
                        id: userData.id,
                        username: userData.username,
                        email: userData.email,
                        isLoggedIn: true,
                        credits: userData.balance,
                        token: "simulated-token-" + Math.random().toString(36).substring(2)
                    };
                    
                    saveUserData(userDataToSave);
                    
                    const creditsElement = document.getElementById("credits");
                    if (creditsElement) {
                        creditsElement.textContent = `💰 ${userData.balance} кредитов`;
                    }
                    
                    closeAllModals();
                    showNotification("Вход выполнен успешно! Добро пожаловать, " + userData.username);
                } catch (error) {
                    console.error('Ошибка входа:', error);
                    showNotification("Ошибка: " + error.message, "error");
                }
            }
        });
    }
}

function checkUserLogin() {
    const savedUserData = getUserData();
    if (savedUserData.username && savedUserData.isLoggedIn) {
        const loginContainer = document.getElementById("loginContainer");
        const userPanel = document.getElementById("userPanel");
        
        if (loginContainer) {
            loginContainer.style.display = "none";
            const openLoginBtn = document.getElementById("openLogin");
            const openRegisterBtn = document.getElementById("openRegister");
            if (openLoginBtn) openLoginBtn.disabled = true;
            if (openRegisterBtn) openRegisterBtn.disabled = true;
        }
        
        if (userPanel) {
            userPanel.style.display = "flex";
            const usernameDisplay = document.getElementById("usernameDisplay");
            if (usernameDisplay) usernameDisplay.textContent = savedUserData.username;
        }
        
        const creditsElement = document.getElementById("credits");
        if (creditsElement) {
            creditsElement.textContent = `💰 ${savedUserData.credits || 0} кредитов`;
        }
    }
}

// Инициализация при загрузке
document.addEventListener("DOMContentLoaded", function() {
    initializeAuth();
});