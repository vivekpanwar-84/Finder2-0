import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon, Users, Camera, ShieldCheck, Globe, MapPin, MessageCircle, Share, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function WelcomeCard() {
    const [greeting, setGreeting] = useState("");
    const { isDark, toggleTheme } = useTheme();

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning!");
        else if (hour < 18) setGreeting("Good afternoon!");
        else setGreeting("Good evening!");
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`mt-6 relative overflow-hidden rounded-3xl shadow-xl mx-4 sm:mx-8 mb-8 p-8 sm:p-7
        ${isDark
                    ? "bg-gradient-to-r from-indigo-900 to-purple-900 text-white"
                    : "bg-gradient-to-r from-blue-400 to-purple-500 text-white"} 
        grid grid-cols-1 md:grid-cols-2 gap-4`}
        >
            {/* Left Section: Greeting & Text */}
            <div className="flex flex-col justify-center">
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl sm:text-4xl font-bold flex items-center gap-2"
                >
                    {isDark ? <Moon className="w-6 h-6 text-yellow-300" /> : <Sun className="w-6 h-6 text-yellow-300" />}
                    {greeting}
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-3 text-lg text-white/90 max-w-xl"
                >
                    Welcome to your Finder dashboard. Discover amazing places, share your
                    adventures, and connect with fellow travelers from around the world.
                </motion.p>

                {/* Features */}
                <div className="mt-6 flex flex-wrap gap-3">
                    {[
                        { icon: <Users className="w-5 h-5" />, text: "Community Driven" },
                        { icon: <ShieldCheck className="w-5 h-5" />, text: "Verified Reviews" },
                        { icon: <Camera className="w-5 h-5" />, text: "Real Photos" },
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + idx * 0.1 }}
                            className="flex items-center gap-2 bg-white/20 backdrop-blur-md 
                px-4 py-2 rounded-full text-sm hover:bg-white/30 transition"
                        >
                            {item.icon}
                            <span>{item.text}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Right Section: Rotating Globe */}
            <div className="flex justify-center items-center mt-6 md:mt-0">
                <motion.div
                    className="relative w-40 h-40 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                >
                    <Globe size={36} className="text-white" />
                    <MapPin className="absolute top-3 left-3 text-white opacity-70" />
                    <MessageCircle className="absolute bottom-3 right-3 text-white opacity-70" />
                    <Share className="absolute top-3 right-3 text-white opacity-70" />
                    <Plus className="absolute bottom-3 left-3 text-white opacity-70" />
                </motion.div>
            </div>
        </motion.div>
    );
}
