import express from 'express';
// import session from 'express-session';
import connectDB from './config/mongo.js';
import cors from 'cors'
import userRoute from './interfaces/routes/userRoutes.js';
import adminRoute from './interfaces/routes/adminRoutes.js';
import postRoute from './interfaces/routes/postRoutes.js';
import friendRoute from './interfaces/routes/friendRoutes.js'
import chatRoute from './interfaces/routes/ChatRoute.js';
import messageRoute from './interfaces/routes/MessageRoute.js';
import {configDotenv} from "dotenv"
import http from "http"
import {Server} from "socket.io"




// const port = process.env.PORT || 3000
const PORT = 8000
const app = express();
app.use(cors());
configDotenv()
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
      origin: "http://localhost:3000",
    },
  });




//CORS
const allowedOrigins = ['https://connectify-cyan.vercel.app/'];
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);





//routes
app.use('/', userRoute);
app.use('/admin', adminRoute);
app.use('/post', postRoute);
app.use('/friend',friendRoute);
app.use('/chat',chatRoute);
app.use('/messages',messageRoute);


app.listen(PORT, () => {
    console.log(`server started at PORT ${PORT}`)
});



//SOCKET
let activeUsers = [];
io.on("connection", (socket) => {
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    // send all active users to new user
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });

  // send message to a specific user
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




//GOOGLE SIGNIN

// Configure Passport.js
// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: process.env.CLIENT_ID ,
//             clientSecret: process.env.SECRET_ID ,
//             callbackURL: 'http://localhost:8000/auth/google/callback',
//         },
//         (accessToken, refreshToken, profile, done) => {
//             // You can perform database operations here to store or retrieve user data
//             return done(null, profile);
//         }
//     )
// );

// passport.serializeUser((user, done) => {
//     done(null, user);
// });

// passport.deserializeUser((user, done) => {
//     done(null, user);
// });

// // Initialize Passport and session
// app.use(session({ secret: process.env.SECRET_ID , resave: true, saveUninitialized: true }));
// app.use(passport.initialize());
// app.use(passport.session());


// // Google OAuth routes
// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
//     res.redirect('http://localhost:3000/feedhome');
// });
