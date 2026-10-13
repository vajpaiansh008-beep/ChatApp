import dotenv from "dotenv";
dotenv.config();
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]); // Fixed MongoDB connection error

import express from "express";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoute.js";
import messageRouter from "./routes/messageRoute.js";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);

// initialize Socket.io and attach it to the http server
export const io = new Server(server, {
  cors: { origin: "*" },
});

// store Online users
export const userSocketMap = {}; // { userId: socketId }

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);

  if (userId) userSocketMap[userId] = socket.id;

  // Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);

    // ✅ Safe Check: Only delete if userId is valid
    if (userId) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

// Connect to Database
connectDB();

// Routes Setup
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
