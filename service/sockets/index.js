const feedHandlers = require("./feedHandlers");
const socketio = require("socket.io");

module.exports = (server) => {
  const io = socketio(server);

  io.on("connection", (socket) => {
    feedHandlers(io, socket);
  });
};
