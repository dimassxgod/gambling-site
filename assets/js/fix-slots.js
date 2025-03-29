// fix-slots.js
document.addEventListener('DOMContentLoaded', function() {
    // Get the slots button
    const slotsBtn = document.getElementById('slotsBtn');
    
    if (slotsBtn) {
        slotsBtn.addEventListener('click', function() {
            const mainContent = document.querySelector(".main-content");
            
            // Create the slots section if it doesn't exist
            let slotsSection = document.getElementById("slots-section");
            
            if (!slotsSection) {
                slotsSection = document.createElement("div");
                slotsSection.id = "slots-section";
                slotsSection.className = "content-section";
                
                slotsSection.innerHTML = `
                    <div class="section-header">
                        <div class="section-title">
                            <img src="/api/placeholder/24/24" alt="Slots" class="section-icon">
                            Слоты
                        </div>
                        <div class="section-dropdown">
                            <span>По популярности</span>
                            <img src="/api/placeholder/16/16" alt="Down" class="dropdown-icon">
                        </div>
                    </div>
                    <div class="games-grid">
                        <div class="game-item">
                            <img src="/api/placeholder/200/120" alt="Slot 1" class="game-image">
                            <div class="game-overlay">
                                <button class="play-button" data-game="slot1">Play now</button>
                            </div>
                            <div class="game-title">FRUIT SPIN</div>
                        </div>
                        <div class="game-item">
                            <img src="/api/placeholder/200/120" alt="Slot 2" class="game-image">
                            <div class="game-overlay">
                                <button class="play-button" data-game="slot2">Play now</button>
                            </div>
                            <div class="game-title">LUCKY 7</div>
                        </div>
                        <div class="game-item">
                            <img src="/api/placeholder/200/120" alt="Slot 3" class="game-image">
                            <div class="game-overlay">
                                <button class="play-button" data-game="slot3">Play now</button>
                            </div>
                            <div class="game-title">MEGA FORTUNE</div>
                        </div>
                        <div class="game-item">
                            <img src="/api/placeholder/200/120" alt="Slot 4" class="game-image">
                            <div class="game-overlay">
                                <button class="play-button" data-game="slot4">Play now</button>
                            </div>
                            <div class="game-title">SPACE ADVENTURE</div>
                        </div>
                    </div>
                `;
                
                // Hide all existing sections
                const sections = document.querySelectorAll(".content-section");
                sections.forEach(section => section.style.display = "none");
                
                const welcomeBanner = document.querySelector(".welcome-banner");
                if (welcomeBanner) {
                    welcomeBanner.style.display = "none";
                }
                
                // Add the slots section to the page
                mainContent.appendChild(slotsSection);
                
                // Add event listeners to play buttons
                const playButtons = slotsSection.querySelectorAll(".play-button");
                playButtons.forEach(button => {
                    button.addEventListener("click", () => {
                        const gameId = button.getAttribute("data-game");
                        if (typeof startGame === 'function') {
                            startGame(gameId);
                        } else {
                            console.error("Function startGame is not defined");
                            alert("Game is under development");
                        }
                    });
                });
            } else {
                // Hide all existing sections
                const sections = document.querySelectorAll(".content-section");
                sections.forEach(section => section.style.display = "none");
                
                const welcomeBanner = document.querySelector(".welcome-banner");
                if (welcomeBanner) {
                    welcomeBanner.style.display = "none";
                }
                
                // Show slots section
                slotsSection.style.display = "block";
            }
            
            // Set active navigation
            const navLinks = document.querySelectorAll('nav ul li a');
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            slotsBtn.classList.add('active');
        });
    }
});