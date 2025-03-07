document.addEventListener("DOMContentLoaded", () => {
    // Модальное окно регистрации
    const openRegisterBtn = document.getElementById("openRegister");
    const closeRegisterBtn = document.getElementById("closeRegister");
    const registerModal = document.getElementById("registerModal");
    const registerForm = document.getElementById("registerForm");
    const claimBonusBtn = document.querySelector(".claim-bonus");

    // Открытие модального окна регистрации
    function openRegisterModal() {
        registerModal.style.display = "flex";
    }

    // Закрытие модального окна
    function closeRegisterModal() {
        registerModal.style.display = "none";
    }

    openRegisterBtn.addEventListener("click", openRegisterModal);
    claimBonusBtn.addEventListener("click", openRegisterModal);
    closeRegisterBtn.addEventListener("click", closeRegisterModal);

    // Закрытие при клике вне окна
    window.addEventListener("click", (e) => {
        if (e.target === registerModal) {
            closeRegisterModal();
        }
    });

    // Обработка регистрации
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const getBonus = document.getElementById("bonusCheckbox").checked;

        if (username && email && password) {
            // Обновляем UI после регистрации
            closeRegisterModal();
            openRegisterBtn.textContent = username;
            
            // Если выбран бонус, добавляем кредиты
            if (getBonus) {
                const creditsElement = document.getElementById("credits");
                const currentCredits = parseInt(creditsElement.textContent.match(/\d+/)[0]);
                const newCredits = currentCredits + 500;
                creditsElement.textContent = `💰 ${newCredits} кредитов`;
                
                // Показываем уведомление о бонусе
                showNotification("Вы получили 500 бонусных кредитов!");
            }
            
            showNotification(`Добро пожаловать, ${username}!`);
        }
    });

    // Функция для отображения уведомлений
    function showNotification(message) {
        const notification = document.createElement("div");
        notification.className = "notification";
        notification.textContent = message;
        notification.style.position = "fixed";
        notification.style.bottom = "20px";
        notification.style.right = "20px";
        notification.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        notification.style.color = "white";
        notification.style.padding = "15px 25px";
        notification.style.borderRadius = "10px";
        notification.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.3)";
        notification.style.zIndex = "9999";
        notification.style.transition = "all 0.3s";
        notification.style.borderLeft = "5px solid #ff416c";
        notification.style.animation = "fadeIn 0.3s, slideIn 0.3s";
        
        document.body.appendChild(notification);
        
        // Удаляем уведомление через 3 секунды
        setTimeout(() => {
            notification.style.opacity = "0";
            notification.style.transform = "translateY(20px)";
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Обработчики для кнопок навигации
    document.getElementById("homeBtn").addEventListener("click", () => {
        window.location.href = "index.html";
    });

    document.getElementById("slotsBtn").addEventListener("click", () => {
        window.location.href = "slots.html";
    });

    document.getElementById("rouletteBtn").addEventListener("click", () => {
        window.location.href = "roulette.html";
    });

    document.getElementById("playSlots").addEventListener("click", () => {
        window.location.href = "slots.html";
    });

    document.getElementById("playRoulette").addEventListener("click", () => {
        window.location.href = "roulette.html";
    });

    document.getElementById("balanceBtn").addEventListener("click", () => {
        showNotification("Раздел баланса скоро будет доступен");
    });

    document.getElementById("bonusBtn").addEventListener("click", () => {
        showNotification("Раздел бонусов скоро будет доступен");
    });

    // Переключение категорий игр
    const categoryButtons = document.querySelectorAll(".category-btn");
    
    categoryButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Удаляем класс active у всех кнопок
            categoryButtons.forEach(btn => btn.classList.remove("active"));
            // Добавляем класс active к нажатой кнопке
            button.classList.add("active");
            
            // Здесь можно добавить логику фильтрации игр
            const category = button.getAttribute("data-category");
            showNotification(`Выбрана категория: ${button.textContent}`);
            
            // Фильтрация игр по категориям
            const gameItems = document.querySelectorAll(".game-item");
            
            if (category === "all") {
                // Показываем все игры
                gameItems.forEach(item => {
                    item.style.display = "block";
                });
            } else {
                // Показываем только игры выбранной категории
                gameItems.forEach(item => {
                    if (item.getAttribute("data-category") === category) {
                        item.style.display = "block";
                    } else {
                        item.style.display = "none";
                    }
                });
            }
        });
    });
    
    // Инициализация популярных игр
    initPopularGames();
    
    // Функция для инициализации популярных игр
    function initPopularGames() {
        const popularGamesContainer = document.querySelector(".popular-games");
        
        // Если контейнер существует
        if (popularGamesContainer) {
            // Примеры популярных игр (в реальном приложении данные могут приходить с сервера)
            const popularGames = [
                { name: "Золото Фараона", image: "images/game1.jpg", category: "slots" },
                { name: "Космические Барабаны", image: "images/game2.jpg", category: "slots" },
                { name: "Европейская Рулетка", image: "images/game3.jpg", category: "roulette" },
                { name: "Фруктовый Взрыв", image: "images/game4.jpg", category: "slots" }
            ];
            
            // Создаем элементы для каждой игры
            popularGames.forEach(game => {
                const gameItem = document.createElement("div");
                gameItem.className = "game-item";
                gameItem.setAttribute("data-category", game.category);
                
                gameItem.innerHTML = `
                    <div class="game-thumbnail">
                        <img src="${game.image}" alt="${game.name}" onerror="this.src='images/placeholder.jpg'">
                    </div>
                    <div class="game-name">${game.name}</div>
                    <button class="play-btn">Играть</button>
                `;
                
                popularGamesContainer.appendChild(gameItem);
                
                // Добавляем обработчик для кнопки "Играть"
                const playBtn = gameItem.querySelector(".play-btn");
                playBtn.addEventListener("click", () => {
                    // Проверяем авторизацию
                    if (openRegisterBtn.textContent === "Регистрация") {
                        // Если пользователь не авторизован, открываем окно регистрации
                        openRegisterModal();
                        showNotification("Для игры необходимо зарегистрироваться");
                    } else {
                        // Перенаправляем на страницу игры
                        if (game.category === "slots") {
                            window.location.href = "slots.html?game=" + encodeURIComponent(game.name);
                        } else if (game.category === "roulette") {
                            window.location.href = "roulette.html?game=" + encodeURIComponent(game.name);
                        }
                    }
                });
            });
        }
    }
    
    // Добавляем анимацию для элементов на странице
    animateElements();
    
    function animateElements() {
        const elementsToAnimate = document.querySelectorAll(".animate-on-load");
        
        elementsToAnimate.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add("visible");
            }, 100 * index);
        });
    }
});