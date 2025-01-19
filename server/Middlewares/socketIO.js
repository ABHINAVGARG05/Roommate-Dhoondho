import { Server } from "socket.io";

export const initSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connect", (socket) => {
    console.log(`${socket.id} connected`);

    socket.emit("welcome", "Welcome to the chat!");

    socket.on("sendMessage", (data) => {
      io.to(data.chatId).emit("newMessage", data);
    });

    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log(`${socket.id} joined chat ${chatId}`);
    });

    socket.on("disconnect", () => {
      console.log(`${socket.id} disconnected`);
    });
  });
};
