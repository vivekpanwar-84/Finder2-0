import express from "express";
import { sendMessage, getMessages, getUserChats } from "../controller/chatController.js";
import userAuth from "../middleware/userAuth.js";

const chatRouter = express.Router();

chatRouter.post("/send/:id", userAuth, sendMessage);
chatRouter.get("/conversation/:id", userAuth, getMessages);
chatRouter.get("/my-chats", userAuth, getUserChats);

export default chatRouter;
