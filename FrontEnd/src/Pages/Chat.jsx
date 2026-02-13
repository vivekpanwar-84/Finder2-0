import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useSearchParams } from "react-router-dom";
import { Send, User } from "lucide-react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const Chat = () => {
    const { user, token } = useAuth();
    const { isDark } = useTheme();
    const [searchParams] = useSearchParams();
    const backendurl = import.meta.env.VITE_BACKEND_URL;

    const [chats, setChats] = useState([]); // List of users to chat with
    const [currentChatUser, setCurrentChatUser] = useState(null); // Selected user
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState(null);

    // Auto-scroll ref
    const messagesEndRef = useRef(null);

    // Initialize Socket
    useEffect(() => {
        if (user && backendurl) {
            const newSocket = io(backendurl);
            setSocket(newSocket);

            return () => newSocket.close();
        }
    }, [user, backendurl]);

    // Join Room & Listen for Messages
    useEffect(() => {
        if (socket && user) {
            socket.emit("join", user._id);

            socket.on("receiveMessage", (newMessage) => {
                // If message is from current chat user, add to messages
                if (currentChatUser && newMessage.sender === currentChatUser._id) {
                    setMessages((prev) => [...prev, newMessage]);
                } else {
                    // Notification for other users
                    // You might want to match sender ID to a name in chat list
                    toast.info("New message received");
                }

                // Update Sidebar Last Message
                setChats((prev) => {
                    const existingChat = prev.find(c => c.user._id === newMessage.sender);
                    if (existingChat) {
                        return prev.map(c =>
                            c.user._id === newMessage.sender
                                ? { ...c, lastMessage: newMessage.message }
                                : c
                        );
                    } else {
                        // If new user (not in list), reload list to fetch details
                        // fetchMyChats(); // calling this might cause loop or be heavy. 
                        // Ideally we fetch just that user or rely on reload. 
                        // For now, let's just trigger a fetch if we can't find them.
                        return prev;
                    }
                });

                // If it was a new user not in list, we should probably fetch chats again
                if (!chats.some(c => c.user._id === newMessage.sender)) {
                    fetchMyChats();
                }
            });

            return () => {
                socket.off("receiveMessage");
            };
        }
    }, [socket, user, currentChatUser, chats]);

    // Initial Load: Fetch My Chats & designated user from URL
    useEffect(() => {
        if (token) {
            fetchMyChats();
        }
    }, [token]);

    const fetchMyChats = async () => {
        try {
            const res = await axios.get(`${backendurl}/api/chat/my-chats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setChats(res.data.chats); // Expecting array of { user, lastMessage, updatedAt }

                // Check URL for specific userId
                const urlUserId = searchParams.get("userId");
                if (urlUserId) {
                    const existingChat = res.data.chats.find(c => c.user._id === urlUserId);
                    if (existingChat) {
                        setCurrentChatUser(existingChat.user);
                    } else {
                        fetchUserDetails(urlUserId);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    };

    const fetchUserDetails = async (id) => {
        try {
            const res = await axios.get(`${backendurl}/api/user/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                // If not in specific chat list, add a temporary object
                if (!chats.some(c => c.user._id === id)) {
                    setChats(prev => [{ user: res.data.user, lastMessage: "", updatedAt: new Date() }, ...prev]);
                }
                setCurrentChatUser(res.data.user);
            }
        } catch (error) {
            console.error(error);
            toast.error("User not found");
        }
    };

    // Fetch Messages when currentChatUser changes
    useEffect(() => {
        if (currentChatUser) {
            fetchMessages();
            // Polling REMOVED in favor of Socket.io
        }
    }, [currentChatUser]);

    const fetchMessages = async () => {
        if (!currentChatUser) return;
        try {
            const res = await axios.get(`${backendurl}/api/chat/conversation/${currentChatUser._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setMessages(res.data.messages);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentChatUser) return;

        try {
            const res = await axios.post(`${backendurl}/api/chat/send/${currentChatUser._id}`,
                { message: newMessage },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                // Add message to own view immediately
                setMessages([...messages, res.data.data]);
                setNewMessage("");

                // Verify if chat list needs update
                if (!chats.find(c => c.user._id === currentChatUser._id)) {
                    fetchMyChats();
                } else {
                    setChats(prev => prev.map(c =>
                        c.user._id === currentChatUser._id
                            ? { ...c, lastMessage: res.data.data.message }
                            : c
                    ));
                }
            }
        } catch (error) {
            toast.error("Failed to send message");
        }
    };

    return (
        <div className={`min-h-screen pt-20 px-4 sm:px-8 ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
            <div className={`max-w-6xl mx-auto h-[80vh] flex rounded-2xl overflow-hidden shadow-2xl ${isDark ? "bg-[#141b2a]" : "bg-white"}`}>

                {/* 👈 Sidebar: Chat List */}
                <div className={`w-full sm:w-1/3 border-r ${isDark ? "border-gray-700" : "border-gray-200"} flex flex-col`}>
                    <div className="p-4 border-b border-gray-700/50">
                        <h2 className="text-xl font-bold">Chats</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {chats.length > 0 ? (
                            chats.map(chat => (
                                <div
                                    key={chat.user._id}
                                    onClick={() => setCurrentChatUser(chat.user)}
                                    className={`p-4 flex items-center gap-3 cursor-pointer transition ${currentChatUser?._id === chat.user._id
                                        ? (isDark ? "bg-blue-900/20 border-r-4 border-blue-500" : "bg-blue-50 border-r-4 border-blue-500")
                                        : (isDark ? "hover:bg-gray-800" : "hover:bg-gray-100")
                                        }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shrink-0">
                                        {chat.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="font-semibold truncate">{chat.user.name}</h3>
                                        {chat.lastMessage && (
                                            <p className={`text-sm truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                                {chat.lastMessage}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 p-4">No conversations yet.</p>
                        )}
                    </div>
                </div>

                {/* 👉 Main Chat Area */}
                <div className="flex-1 flex flex-col w-full">
                    {currentChatUser ? (
                        <>
                            {/* Header */}
                            <div className={`p-4 border-b ${isDark ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"} flex items-center gap-3`}>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
                                    {currentChatUser.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{currentChatUser.name}</h3>
                                    {/* <span className="text-xs text-green-500">Online</span> */}
                                </div>
                            </div>

                            {/* Messages */}
                            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDark ? "bg-[#0f141f]" : "bg-gray-100"}`}>
                                {messages.map((msg, index) => {
                                    const isMe = msg.sender === user._id;
                                    return (
                                        <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                            <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${isMe
                                                ? "bg-blue-600 text-white rounded-br-none"
                                                : (isDark ? "bg-gray-700 text-white rounded-bl-none" : "bg-white text-gray-900 shadow rounded-bl-none")
                                                }`}>
                                                <p>{msg.message}</p>
                                                <span className={`text-[10px] block text-right mt-1 ${isMe ? "text-blue-200" : "text-gray-400"}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <form onSubmit={handleSendMessage} className={`p-4 border-t ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className={`flex-1 px-4 py-3 rounded-full outline-none ${isDark
                                            ? "bg-gray-700 text-white placeholder-gray-400"
                                            : "bg-gray-100 text-gray-900 border border-gray-200"
                                            }`}
                                    />
                                    <button
                                        type="submit"
                                        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                            <div className={`p-6 rounded-full mb-4 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                                <User size={48} />
                            </div>
                            <h3 className="text-xl font-bold">Select a chat</h3>
                            <p>Choose a user from the left to start messaging</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Chat;
