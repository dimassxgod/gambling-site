document.addEventListener("DOMContentLoaded", () => {
    const openRegisterBtn = document.getElementById("openRegister");
    const closeRegisterBtn = document.getElementById("closeRegister");
    const registerModal = document.getElementById("registerModal");
    const registerForm = document.getElementById("registerForm");

    // Скрываем модальное окно при загрузке страницы
    registerModal.style.display = "none";

    // Открытие модального окна регистрации по клику
    openRegisterBtn.addEventListener("click", () => {
        registerModal.style.display = "flex";
    });

    // Закрытие модального окна
    closeRegisterBtn.addEventListener("click", () => {
        registerModal.style.display = "none";
    });

    // Закрытие при клике вне окна
    window.addEventListener("click", (e) => {
        if (e.target === registerModal) {
            registerModal.style.display = "none";
        }
    });

    // Обработка регистрации
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (username && email && password) {
            alert(`Регистрация успешна! Добро пожаловать, ${username}`);
            registerModal.style.display = "none";
            openRegisterBtn.textContent = username;
            openRegisterBtn.disabled = true;
        }
    });

    // Обработчики кнопок навигации (перенаправление на страницы)
    document.getElementById("homeBtn").addEventListener("click", () => {
        window.location.href = "index.html"; // Главная страница
    });

    document.getElementById("slotsBtn").addEventListener("click", () => {
        window.location.href = "slots.html"; // Страница слотов (потом добавить)
    });

    document.getElementById("rouletteBtn").addEventListener("click", () => {
        window.location.href = "roulette.html"; // Страница рулетки (потом добавить)
    });

    document.getElementById("balanceBtn").addEventListener("click", () => {
        window.location.href = "balance.html"; // Страница баланса (потом добавить)
    });

    document.getElementById("bonusBtn").addEventListener("click", () => {
        window.location.href = "bonus.html"; // Страница бонусов (потом добавить)
    });
});
