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
            showSlotsSection();
            break;
        case "rouletteBtn":
            showRouletteSection();
            break;
        case "balanceBtn":
            showBalanceSection();
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

// Заглушки для функций, которые вы определите в соответствующих файлах
function showSlotsSection() {
    console.log("Slots section");
}

function showBalanceSection() {
    console.log("Balance section");
}