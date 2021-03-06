const session = require("../controller/session");
const db = require("../db/Scores");

const clientConnect = (socket) => {
    socket.on("connected", () => {
        emitHighScoresData(socket);
    })
}

const emitHighScoresData = async (socket) => {
    let data = await db.getHighScores();
    socket.emit("updateTable", data);
    setTimeout(emitHighScoresData, 1000 * 60, socket);
}

const updateClientScore =  (socket) => {
    socket.on("updateScore", (data) => {
        score = data.score;
        db.updateRecord(socket.handshake.session.user_id, score);
    });
}

const disconnectClient = (socket) => {
    socket.on("disconnect", () => {
        console.log("Socket has disconnected:", socket.id);
        socket.handshake.session.user_id = null;
    });
}

module.exports = (io) => {
    io.on("connection", (socket) => {
        if (socket.handshake.session.user_id) {
            console.debug(`A new socket joined: ${socket.id}`);
            
            clientConnect(socket);

            updateClientScore(socket);
            
            disconnectClient(socket);
            
        }
    });
};