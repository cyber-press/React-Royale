// Import required modules
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public")); // Serve frontend files

// Game variables
let gameStartTime;
let leaderboard = {};
let playersConnected = 0;

// Handle WebSocket connections
io.on("connection", (socket) => {
    console.log("Player connected:", socket.id);
    playersConnected++;

    // Start the game when two players are connected
    if (playersConnected >= 2) {
        startGame();
    }

    // Handle reaction event
    socket.on("reaction", (data) => {
        if (!gameStartTime) return; // Ignore reactions before game starts

        let reactionTime = ((Date.now() - gameStartTime) / 1000).toFixed(2);
        io.emit("winner", { player: data.player, time: reactionTime });

        // Store leaderboard results
        if (!leaderboard[data.player]) leaderboard[data.player] = [];
        leaderboard[data.player].push(reactionTime);
    });

    // Reset tournament event
    socket.on("resetTournament", () => {
        leaderboard = {};
        io.emit("resetGame");
    });

    // Handle player disconnects
    socket.on("disconnect", () => {
        console.log("Player disconnected:", socket.id);
        playersConnected--;
    });
});

// Start the game with a random delay and a "Get Ready!" message
function startGame() {
    let delay = Math.random() * 2000 + 1000;
    io.emit("start", { message: "Get Ready..." });

    setTimeout(() => {
        gameStartTime = Date.now();
        io.emit("start", { message: "GO!" });
    }, delay);
}

// Start the server on port 3000
server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
