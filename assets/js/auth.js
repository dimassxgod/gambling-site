// auth.js
import { showNotification } from './utils.js';
import { saveUserData, updateCredits } from './utils.js';

export function initializeAuth() {
    const openRegisterBtn = document.getElementById("openRegister");
    const closeRegisterBtn = document.getElementById("closeRegister");
    const registerModal = document.getElementById("registerModal");
    const registerForm = document.getElementById("registerForm");
    const signupBtn = document.querySelector(".signup-btn");

    function openRegisterModal() {
        registerModal.style.display = "flex";
    }

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

    window.addEventListener("click", (e) => {
        if (e.target === registerModal) {
            closeRegisterModal();
        }
    });

    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const getBonus = document.getElementById("bonusCheckbox").checked;

            if (username && email && password) {
                document.getElementById("openRegister").textContent = username;
                document.getElementById("openRegister").classList.add("logged-in");
                
                if (getBonus) {
                    updateCredits(500);
                }
                
                closeRegisterModal();
                saveUserData(username, email, getBonus);
                
                showNotification("Регистрация успешна! Добро пожаловать, " + username);
            }
        });
    }
}

export function checkUserLogin() {
    const savedUserData = JSON.parse(localStorage.getItem("allcashUserData") || "{}");
    if (savedUserData.username && savedUserData.isLoggedIn) {
        document.getElementById("openRegister").textContent = savedUserData.username;
        document.getElementById("openRegister").classList.add("logged-in");
        
        const creditsElement = document.getElementById("credits");
        creditsElement.textContent = `💰 ${savedUserData.credits} кредитов`;
    }
}
