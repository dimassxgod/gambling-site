document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll("nav a");
    
    navItems.forEach(item => {
        item.addEventListener("click", function(e) {
            e.preventDefault();
            
            // Убираем активный класс со всех элементов
            navItems.forEach(navItem => navItem.classList.remove("active"));
            
            // Добавляем активный класс текущему элементу
            this.classList.add("active");
            
            // Вызываем функцию отображения контента
            showContent(this.id);
        });
    });
});

function showContent(contentId) {
    const mainContent = document.querySelector(".main-content");
    const sections = mainContent.querySelectorAll(".content-section");
    const welcomeBanner = document.querySelector(".welcome-banner");
    
    // Скрываем все секции и баннер
    sections.forEach(section => section.style.display = "none");
    welcomeBanner.style.display = "none";
    
    switch(contentId) {
        case "homeBtn":
            sections.forEach(section => section.style.display = "block");
            welcomeBanner.style.display = "flex";
            break;
        case "slotsBtn":
            // Import and use the showSlotsSection function from slots.js
            if (typeof window.showSlotsSection === 'function') {
                window.showSlotsSection();
            } else {
                console.error("Function showSlotsSection is not defined");
            }
            break;
        case "rouletteBtn":
            // Import and use the showRouletteSection function from roulette.js
            if (typeof window.showRouletteSection === 'function') {
                window.showRouletteSection();
            } else {
                console.error("Function showRouletteSection is not defined");
            }
            break;
        case "balanceBtn":
            // Import and use the showBalanceSection function from balance.js
            if (typeof window.showBalanceSection === 'function') {
                window.showBalanceSection();
            } else {
                console.error("Function showBalanceSection is not defined");
            }
            break;
        case "bonusBtn":
            // Показываем только секцию бонусов
            const bonusSection = Array.from(sections).find(section => 
                section.querySelector(".section-title").textContent.includes("Bonuses")
            );
            if (bonusSection) bonusSection.style.display = "block";
            break;
    }
}