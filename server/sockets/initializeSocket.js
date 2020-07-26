const session = require("../controller/session");

module.exports = (sess) => {
    const io = require("socket.io")(require("../server").server);
    io.use(session.ioSession(sess));
    require("./sockets")(io);
}