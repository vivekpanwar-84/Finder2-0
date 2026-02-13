import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { Sun, Moon, Menu, X, LogOut, LogIn, Home, List, Info, PlusCircle, Settings } from "lucide-react";

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const { isDark, toggleTheme } = useTheme();
    const { isAuthenticated, logout } = useAuth();


    const handleLogout = () => {
        logout();
        setVisible(false);
    };

    const navItems = [
        { name: "Home", icon: Home, path: "/" },
        { name: "Listing", icon: List, path: "/listing" },
        { name: "AddNewPlace", icon: PlusCircle, path: "/addnewplace" },
        { name: "About", icon: Info, path: "/about" },
    ];

    return (
        <>
            {/* Mobile Header */}
            <div className={`sm:hidden fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 shadow-md transition-colors duration-300 ${isDark ? "bg-gray-900 text-white border-b border-gray-700" : "bg-white text-gray-900 border-b border-gray-200"}`}>
                <NavLink to="/" className="text-2xl font-bold text-blue-500">
                    FINDER.
                </NavLink>
                <button onClick={() => setVisible(true)} className="p-2">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Sidebar (Desktop & Mobile Drawer) */}
            <div className={`fixed top-0 left-0 h-full z-50 w-64 transform transition-transform duration-300 ease-in-out shadow-xl flex flex-col justify-between
                ${isDark ? "bg-gray-900 text-white border-r border-gray-700" : "bg-white text-gray-900 border-r border-gray-200"}
                ${visible ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
            `}>

                {/* Top Section */}
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <NavLink to="/" className="text-3xl font-bold text-blue-500">
                            FINDER.
                        </NavLink>
                        {/* Close Button for Mobile */}
                        <button onClick={() => setVisible(false)} className="sm:hidden p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-2">
                        {navItems.map((item, idx) => (
                            <NavLink
                                key={idx}
                                to={item.path}
                                onClick={() => setVisible(false)}
                                className={({ isActive }) =>
                                    `px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 flex items-center gap-3 group
                                    ${isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 translate-x-1"
                                        : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 hover:translate-x-1"
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Bottom Section */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col gap-4">
                        {/* Settings / Profile */}
                        {isAuthenticated && (
                            <NavLink
                                to="/profile"
                                onClick={() => setVisible(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium
                                ${isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                                    }`
                                }
                            >
                                <Settings className="w-5 h-5" />
                                <span>Settings</span>
                            </NavLink>
                        )}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-300 font-medium"
                        >
                            {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
                            <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
                        </button>

                        {/* Auth Buttons */}
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 w-full rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all font-medium"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <NavLink
                                    to="/login"
                                    onClick={() => setVisible(false)}
                                    className="flex items-center justify-center gap-2 px-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span>Sign In</span>
                                </NavLink>
                                <NavLink
                                    to="/login"
                                    onClick={() => setVisible(false)}
                                    className="flex items-center justify-center gap-2 px-4 py-2 w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md"
                                >
                                    <span>Sign Up</span>
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Overlay for Mobile */}
            {visible && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 sm:hidden backdrop-blur-sm"
                    onClick={() => setVisible(false)}
                ></div>
            )}
        </>
    );
};

export default Navbar;  