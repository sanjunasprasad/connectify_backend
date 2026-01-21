import express from 'express';
import connectDB from './config/mongo.js';
import cors from 'cors'
import userRoute from './interfaces/routes/userRoutes.js';
import adminRoute from './interfaces/routes/adminRoutes.js';
import postRoute from './interfaces/routes/postRoutes.js';
import friendRoute from './interfaces/routes/friendRoutes.js'
import chatRoute from './interfaces/routes/ChatRoute.js';
import messageRoute from './interfaces/routes/MessageRoute.js';
import dotenv from "dotenv"
import http from "http"
import {Server} from "socket.io"

const app = express();
dotenv.config()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'));
app.use('/public/image', express.static('public/image'));
connectDB();

//CORS
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://connectify-omega-mauve.vercel.app',
      'https://connectify-git-main-sanjuna-s-prasads-projects.vercel.app'
    ],
    methods: 'GET, PUT, POST, DELETE, PATCH',
    credentials: true,  // ← Changed to true
  })
);

//routes
app.use('/', userRoute);
app.use('/admin', adminRoute);
app.use('/post', postRoute);
app.use('/friend',friendRoute);
app.use('/chat',chatRoute);
app.use('/messages',messageRoute);

//SOCKET
const httpserver = http.createServer(app)
const io = new Server(httpserver, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://connectify-omega-mauve.vercel.app",
      "https://connectify-git-main-sanjuna-s-prasads-projects.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true,  // ← Changed to true
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

//SOCKET
let activeUsers = [];
io.on("connection", (socket) => {
  socket.on("new-user-add", (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    io.emit("get-users", activeUsers);
  });

  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to receiver :", receiverId)
    console.log("Data: ", data)
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });
});

const port = 8000
httpserver.listen(port, () => {
  console.log(`server started at PORT ${port}`)
});