// utils.js
export function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add("show");
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

export function updateCredits(amount) {
    const creditsElement = document.getElementById("credits");
    const currentCredits = parseInt(creditsElement.textContent.match(/\d+/)[0], 10);
    const newCredits = currentCredits + amount;
    
    creditsElement.textContent = `💰 ${newCredits} кредитов`;
    
    creditsElement.classList.add("credits-update");
    setTimeout(() => {
        creditsElement.classList.remove("credits-update");
    }, 1000);
    
    const userData = JSON.parse(localStorage.getItem("allcashUserData") || "{}");
    if (userData.username) {
        userData.credits = newCredits;
        localStorage.setItem("allcashUserData", JSON.stringify(userData));
    }
    
    return newCredits;
}

export function saveUserData(username, email, hasBonus) {
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

export function getUserData() {
    return JSON.parse(localStorage.getItem("allcashUserData") || "{}");
}
