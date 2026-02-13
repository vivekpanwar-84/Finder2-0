import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { createRequire } from 'module';
import { connect } from 'http2';
const require = createRequire(import.meta.url);
import connectDB from './config/mongodb.js';
import connectcloudinary from './config/cloudnary.js';
import userRouter from './router/userRoute.js';
import listingRoute from './router/listingRoute.js';
import reviewRoutes from "./router/reviewRoutes.js";
//add config 
const app = express();
const port = process.env.PORT || 8090;
connectDB();
connectcloudinary();


// middleware
app.use(express.json());
app.use(cors());

// api endpoint
app.use("/api/user", userRouter);
app.use("/api/listing", listingRoute);
app.use("/api/review", reviewRoutes);


import path from 'path';

const __dirname = path.resolve();

app.listen(port, () => {
    console.log(`server start....${port}`);
});

// Serve static files from the frontend dist folder
app.use(express.static(path.join(__dirname, '../FrontEnd/dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../FrontEnd/dist', 'index.html'));
});

