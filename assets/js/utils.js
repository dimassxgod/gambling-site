// utils.js

// Функция для инициализации данных пользователя при первой загрузке
function initUserData() {
    if (!localStorage.getItem('userData')) {
        const initialData = {
            username: "Гость",
            credits: 1000,
            registered: null,
            gamesPlayed: 0
        };
        localStorage.setItem('userData', JSON.stringify(initialData));
    }
    
    // Обновляем отображение кредитов в хедере
    updateHeaderCredits();
}

// Получение данных пользователя из localStorage
function getUserData() {
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

// Обновление количества кредитов
function updateCredits(amount) {
    const userData = getUserData();
    userData.credits = (userData.credits || 1000) + amount;
    
    // Сохраняем обновленные данные
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Обновляем отображение в хедере
    updateHeaderCredits();
    
    // Если открыта страница баланса, обновляем отображение там
    const balanceAmount = document.querySelector(".balance-amount");
    if (balanceAmount) {
        balanceAmount.textContent = `💰 ${userData.credits} кредитов`;
    }
    
    return userData.credits;
}

// Обновление отображения кредитов в хедере
function updateHeaderCredits() {
    const userData = getUserData();
    
    const creditsElement = document.getElementById("credits");
    if (creditsElement) {
        creditsElement.textContent = `💰 ${userData.credits} кредитов`;
    }
}

// Функция для отображения уведомлений
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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initUserData();
    
    // Обработчик для кнопки регистрации/входа
    const openRegisterBtn = document.getElementById('openRegister');
    const registerModal = document.getElementById('registerModal');
    const closeRegisterBtn = document.getElementById('closeRegister');
    
    if (openRegisterBtn && registerModal) {
        openRegisterBtn.addEventListener('click', function() {
            registerModal.style.display = 'flex';
        });
    }
    
    if (closeRegisterBtn && registerModal) {
        closeRegisterBtn.addEventListener('click', function() {
            registerModal.style.display = 'none';
        });
    }
    
    // Закрытие модального окна при клике вне его
    window.addEventListener('click', function(e) {
        if (e.target == registerModal) {
            registerModal.style.display = 'none';
        }
    });
    
    // Обработка формы регистрации
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = registerForm.username.value;
            const email = registerForm.email.value;
            const bonusChecked = registerForm.bonusCheckbox.checked;
            
            const userData = getUserData();
            userData.username = username;
            userData.email = email;
            userData.registered = new Date().toISOString();
            
            // Если пользователь выбрал бонус
            if (bonusChecked) {
                userData.credits += 500;
            }
            
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Обновляем отображение кредитов
            updateHeaderCredits();
            
            // Закрываем модальное окно
            registerModal.style.display = 'none';
            
            // Показываем уведомление
            showNotification(`Аккаунт ${username} успешно создан!${bonusChecked ? ' +500 кредитов бонус!' : ''}`, 'success');
        });
    }
});

// Экспортируем функции для использования в других файлах
window.getUserData = getUserData;
window.updateCredits = updateCredits;
window.showNotification = showNotification;