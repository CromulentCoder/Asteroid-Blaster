const SECRET = require("../../config").SECRET;

const expressSession = require("express-session");
const sharedSession = require("express-socket.io-session");

// Create session
const session = expressSession({
    key: "user_id",
    secret: SECRET,
    resave: true,
    saveUninitialized: true,
});

const ioSession = (socketSession) => {
    console.log("In ioSession");
    return sharedSession(
    socketSession, {
        autoSave: true
    });
}

module.exports = {session, ioSession};

