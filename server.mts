import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { use } from "react";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port }); // creates a Next.js application instance.
const handle = app.getRequestHandler(); // returns a handler that knows how to serve all Next.js routes

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log(`User is connected ${socket.id}`);

    socket.on("join-room", ({ room, userName }) => {
      console.log(`User ${userName} joined room ${room}`);
      socket.join(room);
      socket.to(room).emit("user-joined", `${userName} joined the room`);
    });

    socket.on("message", ({ room, message, sender }) => {
      console.log(`Message received in room ${room}: ${message}`);
      socket.to(room).emit("message", { sender, message });
    });

    socket.on("disconnect", () => {
      console.log(`User is disconnected ${socket.id}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
  });
});
