const socket = io();
let player = Math.random() < 0.5 ? "Player 1" : "Player 2"; 

socket.on("start", (data) => {
    document.getElementById("gameStatus").innerText = data.message;
});

socket.on("winner", (data) => {
    document.getElementById("winner").innerText = `${data.player} Wins! Reaction Time: ${data.time}s`;
});

function sendReaction() {
    socket.emit("reaction", { player });
}
