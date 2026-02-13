import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, AlertTriangle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const NotFound = () => {
    const { isDark } = useTheme();

    return (
        <div className={`min-h-[80vh] flex flex-col items-center justify-center p-6 text-center transition-colors duration-300 ${isDark ? "text-white" : "text-gray-900"}`}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
            >
                <div className="relative">
                    <h1 className="text-9xl font-extrabold text-blue-500 opacity-20 select-none">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <AlertTriangle className="w-24 h-24 text-blue-500" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold mt-4 mb-2">Page Not Found</h2>
                <p className="text-gray-500 max-w-md mb-8">
                    Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <Link
                    to="/"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 font-medium"
                >
                    <Home size={20} />
                    Back to Home
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;
