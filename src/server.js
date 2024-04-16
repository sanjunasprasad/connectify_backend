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




const port = process.env.PORT 
const app = express();
dotenv.config()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'));
app.use('/public/videos', express.static('public/videos'));
app.use('/public/image', express.static('public/image'));
connectDB();



//SOCKET
const server = http.createServer(app)
const io = new Server( server,{
    cors: {
      origin: "https://connectify-cyan.vercel.app",
      methods: ["GET" , "POST"],
      credentials : false,
    },
    transports: ["websocket" ,"polling"],
    allowEIO3 : true,
  });




//CORS
const allowedOrigins = ['https://connectify-cyan.vercel.app'];
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: false,
    })
);





//routes
app.use('/', userRoute);
app.use('/admin', adminRoute);
app.use('/post', postRoute);
app.use('/friend',friendRoute);
app.use('/chat',chatRoute);
app.use('/messages',messageRoute);


app.listen(port, () => {
    console.log(`server started at PORT ${port}`)
});



//SOCKET
let activeUsers = [];
io.on("connection", (socket) => {
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      // console.log("New User Connected", activeUsers);
    }
    // send all active users to new user
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    // console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });

  // send message to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    // console.log("Sending from socket to receiver :", receiverId)
    // console.log("Data: ", data)
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });
});




