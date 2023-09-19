const ioServer = require("socket.io");

class SocketServer {
  constructor(server) {
    this.io = ioServer(server, {
      cors: {
        origin: "*",
      },
    });
    this.setup();
  }

  setup() {
    this.io.on("connection", (socket) => {
      console.log("A new client connected");
      const id = socket.handshake.query.id;
      socket.join(id);

      socket.on("send-message", ({ recipients, text }) => {
        recipients.forEach((recipient) => {
          const newRecipients = recipients.filter((r) => r !== recipient);
          newRecipients.push(id);
          socket.broadcast.to(recipient).emit("receive-message", {
            recipients: newRecipients,
            sender: id,
            text,
          });
        });
      });
    });
  }

  getServer() {
    return this.io;
  }
}

module.exports = SocketServer;
