import Message from "../model/messageModel.js";
import User from "../model/userModel.js";
import { io, userSocketMap } from "../app.js";

// Send Message
const sendMessage = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const { message } = req.body;
        const senderId = req.user.id;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            message
        });

        await newMessage.save();

        // Real-time update via Socket.io
        const receiverSocketId = userSocketMap.get(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage", {
                sender: senderId,
                message: newMessage.message,
                createdAt: newMessage.createdAt
            });
        }

        res.status(201).json({ success: true, message: "Message sent", data: newMessage });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Conversation between two users
const getMessages = async (req, res) => {
    try {
        const { id: chatterId } = req.params;
        const userId = req.user.id;

        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: chatterId },
                { sender: chatterId, receiver: userId }
            ]
        }).sort({ createdAt: 1 });

        res.json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get List of Users interacted with (including last message)
const getUserChats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find detailed chat list with last message
        // 1. Find all messages involving current user
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        }).sort({ createdAt: -1 });

        const chatMap = new Map();

        messages.forEach(msg => {
            const otherUserId = msg.sender.toString() === userId
                ? msg.receiver.toString()
                : msg.sender.toString();

            if (!chatMap.has(otherUserId)) {
                chatMap.set(otherUserId, {
                    lastMessage: msg.message,
                    updatedAt: msg.createdAt,
                    // We will populate user details next
                });
            }
        });

        const chatList = [];
        for (const [otherUserId, chatData] of chatMap) {
            const user = await User.findById(otherUserId).select("name email");
            if (user) {
                chatList.push({
                    user,
                    lastMessage: chatData.lastMessage,
                    updatedAt: chatData.updatedAt
                });
            }
        }

        res.json({ success: true, chats: chatList });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { sendMessage, getMessages, getUserChats };
