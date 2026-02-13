import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import connectDB from './config/mongodb.js';
import connectcloudinary from './config/cloudnary.js';

import userRouter from './router/userRoute.js';
import listingRoute from './router/listingRoute.js';
import reviewRoutes from "./router/reviewRoutes.js";
import chatRouter from "./router/chatRoute.js";

dotenv.config();

import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for now (adjust for production)
        methods: ["GET", "POST"]
    }
});

// Store active users { userId: socketId }
const userSocketMap = new Map();

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join', (userId) => {
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User ${userId} joined with socket ${socket.id}`);
        }
    });

    socket.on('sendMessage', ({ senderId, receiverId, message, createdAt }) => {
        const receiverSocketId = userSocketMap.get(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('receiveMessage', {
                sender: senderId,
                message,
                createdAt
            });
        }
    });

    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
        // Remove user from map
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    });
});

// Export io to be used in controllers if needed (or just use socket event for real-time)
export { io, userSocketMap };

const port = process.env.PORT || 8090;

// DB & Cloudinary
connectDB();
connectcloudinary();

// middleware
app.use(express.json());
app.use(cors());

// API routes
app.use("/api/user", userRouter);
app.use("/api/listing", listingRoute);
app.use("/api/review", reviewRoutes);
app.use("/api/chat", chatRouter);

// ==================
// ✅ FRONTEND SERVE
// ==================

const __dirname = path.resolve();

// Vite build folder
app.use(express.static(path.join(__dirname, '../FrontEnd/dist')));

// ⭐ CATCH-ALL (API ke baad, listen se pehle)
app.get('*', (req, res) => {
    res.sendFile(
        path.join(__dirname, '../FrontEnd/dist', 'index.html')
    );
});

// ==================
// SERVER START
// ==================
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
