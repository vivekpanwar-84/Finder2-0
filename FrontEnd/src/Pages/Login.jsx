import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import { toast } from 'react-toastify';

export default function AuthTravelShare() {
    const backendurl = import.meta.env.VITE_BACKEND_URL;
    const { isDark } = useTheme();
    const [mode, setMode] = useState("login"); // 'signup' or 'login'
    const [form, setForm] = useState({
        name: "",   // backend expects 'name'
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    // ✅ Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // ✅ Submit Function using Axios
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend Validation
        if (mode === 'signup' && form.password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setLoading(true);

        const url =
            mode === "signup"
                ? backendurl + "/api/user/register"
                : backendurl + "/api/user/login";

        try {
            const response = await axios.post(url, form); // Axios auto stringifies JSON
            const data = response.data;
            console.log("Response:", data);

            if (data.success) {
                if (mode === "signup") {
                    toast.success(response.data.message);
                    setMode("login");
                } else {
                    toast.success("Login successful!");
                    login(response.data.token, response.data.user);
                    navigate("/"); // Redirect
                }
            } else {
                toast.error(response.data.message)
            }
        } catch (err) {
            console.error("Error:", err);
            const msg = err.response?.data?.message || "Server Error";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            className={`min-h-screen flex items-center justify-center px-4 py-10 transition-colors duration-500 ${isDark ? "bg-[#0b1120] text-white" : "bg-gray-50 text-gray-900"
                }`}
        >
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`w-full max-w-md rounded-2xl shadow-xl border p-8 ${isDark
                    ? "bg-[#141b2a] border-[#2a3550]/40"
                    : "bg-white border-gray-200"
                    }`}
            >
                {/* Mode Toggle */}
                <div className="flex justify-center mb-6">
                    <div
                        className={`flex w-full text-white max-w-[280px] rounded-xl border ${isDark
                            ? "border-gray-700 bg-[#1b2437]"
                            : "border-gray-200 bg-gray-100"
                            }`}
                    >
                        <button
                            type="button"
                            onClick={() => setMode("signup")}
                            className={`w-1/2 py-2 rounded-xl text-sm font-medium transition ${mode === "signup"
                                ? "bg-blue-500 text-white"
                                : "text-gray-400 hover:text-gray-700"
                                }`}
                        >
                            Sign Up
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode("login")}
                            className={`w-1/2 py-2 rounded-xl text-sm font-medium transition ${mode === "login"
                                ? "bg-blue-500 text-white"
                                : "text-gray-400 hover:text-gray-700"
                                }`}
                        >
                            Login
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {mode === "signup" && (
                        <motion.div
                            key="signup-name"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <label className="block font-medium mb-1">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className={`w-full px-4 py-2 rounded-lg border text-sm focus:ring-2 outline-none ${isDark
                                    ? "bg-[#0f172a] border-gray-600 text-white focus:ring-blue-400"
                                    : "bg-white border-gray-300 focus:ring-blue-500"
                                    }`}
                                required
                            />
                        </motion.div>
                    )}

                    {/* Email */}
                    <div>
                        <label className="block font-medium mb-1">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter your email address"
                            className={`w-full px-4 py-2 rounded-lg border text-sm focus:ring-2 outline-none ${isDark
                                ? "bg-[#0f172a] border-gray-600 text-white focus:ring-blue-400"
                                : "bg-white border-gray-300 focus:ring-blue-500"
                                }`}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block font-medium mb-1">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className={`w-full px-4 py-2 rounded-lg border text-sm focus:ring-2 outline-none ${isDark
                                ? "bg-[#0f172a] border-gray-600 text-white focus:ring-blue-400"
                                : "bg-white border-gray-300 focus:ring-blue-500"
                                }`}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        type="submit"
                        disabled={loading}
                        className={`w-full mt-4 py-3 rounded-lg font-medium shadow transition ${loading
                            ? "bg-gray-400 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                            }`}
                    >
                        {loading
                            ? "Processing..."
                            : mode === "signup"
                                ? "👤 Create Account"
                                : (
                                    <>
                                        <Lock className="inline mr-2" size={16} /> Sign In
                                    </>
                                )}
                    </motion.button>
                </form>

                {/* Footer */}
                <p className="text-center text-sm text-gray-400 mt-6">
                    {mode === "signup" ? (
                        <>
                            Already have an account?{" "}
                            <span
                                className="text-blue-500 cursor-pointer hover:underline"
                                onClick={() => setMode("login")}
                            >
                                Login
                            </span>
                        </>
                    ) : (
                        <>
                            Don’t have an account?{" "}
                            <span
                                className="text-blue-500 cursor-pointer hover:underline"
                                onClick={() => setMode("signup")}
                            >
                                Sign Up
                            </span>
                        </>
                    )}
                </p>
            </motion.div>
        </section>
    );
}
