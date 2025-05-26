const socket = io();

// Assign player dynamically and display it
let player = Math.random() < 0.5 ? "Player 1" : "Player 2";
document.addEventListener("DOMContentLoaded", () => {
    const playerStatus = document.getElementById("playerStatus");
    if (playerStatus) playerStatus.innerText = `You are ${player}`;
});

// Ensure elements exist before updating UI
socket.on("start", (data) => {
    const gameStatus = document.getElementById("gameStatus");
    if (gameStatus) gameStatus.innerText = data.message;
});

socket.on("winner", (data) => {
    const winnerDisplay = document.getElementById("winner");
    if (winnerDisplay) winnerDisplay.innerText = `${data.player} Wins! Reaction Time: ${data.time}s`;
});

// Prevent multiple reactions & reset after each round
let hasReacted = false;
function sendReaction() {
    if (!hasReacted) {
        socket.emit("reaction", { player });
        hasReacted = true; // Prevent extra clicks
    } else {
        alert("You've already reacted! Wait for the next round.");
    }
}

// Attach event listeners safely
document.addEventListener("DOMContentLoaded", () => {
    const player1Btn = document.getElementById("player1");
    const player2Btn = document.getElementById("player2");

    if (player1Btn && player2Btn) {
        player1Btn.addEventListener("click", sendReaction);
        player2Btn.addEventListener("click", sendReaction);
    }
});

// Debug logs to confirm functionality
console.log(`You are ${player}. Waiting for the game to start...`);
