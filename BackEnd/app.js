import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import connectDB from './config/mongodb.js';
import connectcloudinary from './config/cloudnary.js';

import userRouter from './router/userRoute.js';
import listingRoute from './router/listingRoute.js';
import reviewRoutes from "./router/reviewRoutes.js";

dotenv.config();

const app = express();
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
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
