const socket = io();
let player = Math.random() < 0.5 ? "Player 1" : "Player 2"; 

// Ensure game elements exist before updating
socket.on("start", (data) => {
    const gameStatus = document.getElementById("gameStatus");
    if (gameStatus) gameStatus.innerText = data.message;
});

socket.on("winner", (data) => {
    const winnerDisplay = document.getElementById("winner");
    if (winnerDisplay) winnerDisplay.innerText = `${data.player} Wins! Reaction Time: ${data.time}s`;
});

// Prevent multiple reactions from the same player
let hasReacted = false;
function sendReaction() {
    if (!hasReacted) {
        socket.emit("reaction", { player });
        hasReacted = true; // Prevent extra clicks
    }
}

// Ensure buttons properly trigger the reaction
document.getElementById("player1").addEventListener("click", sendReaction);
document.getElementById("player2").addEventListener("click", sendReaction);

// Debug logs to confirm functionality
console.log(`You are ${player}. Waiting for the game to start...`);
