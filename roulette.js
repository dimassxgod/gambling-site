const balanceElement = document.getElementById("balance");
const betAmountInput = document.getElementById("betAmount");
const resultMessage = document.getElementById("resultMessage");
const canvas = document.getElementById("rouletteCanvas");
const ctx = canvas.getContext("2d");

let balance = 1000; // Начальный баланс
const colors = [
    { name: "black", probability: 0.5, multiplier: 2 },
    { name: "red", probability: 0.3, multiplier: 3 },
    { name: "blue", probability: 0.15, multiplier: 5 },
    { name: "gold", probability: 0.05, multiplier: 50 }
];

function drawRouletteWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2.5;
    const sliceAngle = (2 * Math.PI) / colors.length;
    
    colors.forEach((segment, index) => {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, index * sliceAngle, (index + 1) * sliceAngle);
        ctx.closePath();
        ctx.fillStyle = segment.name;
        ctx.fill();
    });
}

drawRouletteWheel();

function getRandomColor() {
    let random = Math.random();
    let cumulativeProbability = 0;

    for (let color of colors) {
        cumulativeProbability += color.probability;
        if (random < cumulativeProbability) {
            return color;
        }
    }
    return colors[0]; // По умолчанию чёрное (на случай погрешностей)
}

function spinRoulette(selectedColor) {
    let betAmount = parseInt(betAmountInput.value, 10);

    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
        resultMessage.textContent = "Некорректная ставка!";
        return;
    }

    let winningColor = getRandomColor();
    let win = winningColor.name === selectedColor;

    if (win) {
        balance += betAmount * (winningColor.multiplier - 1);
        resultMessage.textContent = `Вы выиграли! Выпал цвет ${winningColor.name.toUpperCase()}`;
    } else {
        balance -= betAmount;
        resultMessage.textContent = `Вы проиграли! Выпал цвет ${winningColor.name.toUpperCase()}`;
    }

    balanceElement.textContent = `Баланс: ${balance} кредитов`;
}

function updateHistory(color, betAmount, win) {
    const historyList = document.getElementById("historyList");
    let resultText = win ? "Выиграл!" : "Проиграл!";
    let listItem = document.createElement("li");
    listItem.textContent = `Вы поставили ${betAmount} на ${color.toUpperCase()} → ${resultText}`;
    historyList.prepend(listItem); // Добавляет в начало списка
}

// Назначаем кнопки для каждого цвета
document.getElementById("blackButton").addEventListener("click", () => spinRoulette("black"));
document.getElementById("redButton").addEventListener("click", () => spinRoulette("red"));
document.getElementById("blueButton").addEventListener("click", () => spinRoulette("blue"));
document.getElementById("goldButton").addEventListener("click", () => spinRoulette("gold"));
