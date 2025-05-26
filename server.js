const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public")); // Serve frontend files

let gameStartTime;
let leaderboard = {};

io.on("connection", (socket) => {
    console.log("Player connected:", socket.id);

    socket.on("reaction", (data) => {
        if (gameStartTime) {
            let reactionTime = ((Date.now() - gameStartTime) / 1000).toFixed(2);
            io.emit("winner", { player: data.player, time: reactionTime });

            // Store leaderboard results
            if (!leaderboard[data.player]) leaderboard[data.player] = [];
            leaderboard[data.player].push(reactionTime);
        }
    });

    socket.on("resetTournament", () => {
        leaderboard = {};
        io.emit("resetGame");
    });

    function startGame() {
        let delay = Math.random() * 2000 + 1000;
        setTimeout(() => {
            gameStartTime = Date.now();
            io.emit("start", { message: "GO!" });
        }, delay);
    }

    socket.on("disconnect", () => {
        console.log("Player disconnected:", socket.id);
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
