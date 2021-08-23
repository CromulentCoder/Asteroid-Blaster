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
    setTimeout(emitHighScoresData, 1000 * 60 * 10, socket);
}

const updateClientScore = (socket) => {
    socket.on("updateScore", async (data) => {
        let previousRecord = await db.getHighScore(socket.handshake.session.user_id);
        let previousScore = previousRecord.score;
        let previousUpdatedAt = previousRecord.updatedAt;
        let currDate = new Date();
        let diff = previousUpdatedAt == null ? 0 : (currDate - previousUpdatedAt) / 1000;
        let score = data.score;
        if ((previousScore == 0 && diff > 10000)|| previousScore != 0 && score - previousScore > diff * 100) {
            return;
        }
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