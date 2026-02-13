import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";

const DBURL = process.env.MONGODB_URL;

connectDB().then(() => {
    console.log("DB Connect......");
})
    .catch((err) => {
        console.log(err);
    });


async function connectDB() {
    await mongoose.connect(DBURL);
};

export default connectDB;