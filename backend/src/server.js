import express from "express";
import http from "http";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { socketAuthMiddleware } from "./middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);
const __dirname = path.resolve();

/* -------------------- MIDDLEWARE -------------------- */

// body parsing (for images / base64 uploads)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// cookies (JWT)
app.use(cookieParser());

// CORS (must allow credentials)
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);

/* -------------------- ROUTES -------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

/* -------------------- SOCKET.IO -------------------- */

const io = new Server(server, {
  cors: {
    origin: ENV.CLIENT_URL,
    credentials: true,
  },
});

// socket authentication
io.use(socketAuthMiddleware);

// online users map
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.user.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  // broadcast online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// make io available in routes if needed
app.set("io", io);

/* -------------------- PRODUCTION FRONTEND -------------------- */

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

/* -------------------- START SERVER -------------------- */

connectDB().then(() => {
  server.listen(ENV.PORT, () => {
    console.log(`🚀 Server running on port ${ENV.PORT}`);
  });
});
