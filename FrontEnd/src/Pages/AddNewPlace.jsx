import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Upload } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from 'react-toastify';


export default function AddListingForm() {
    const { isDark, getlistingData } = useTheme();
    const { token } = useAuth();
    const backendurl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
        location: "",
        country: "",
    });

    const [image1, setImage1] = useState(false);
    const [image2, setImage2] = useState(false);
    const [image3, setImage3] = useState(false);
    const [image4, setImage4] = useState(false);
    const [loading, setLoading] = useState(false);
    const [charCount, setCharCount] = useState(0);

    // handle text fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (name === "description") setCharCount(value.length);
    };

    // Validation function
    const validateForm = () => {
        const { title, description, category, location, country } = form;
        if (!title || !description || !category || !location || !country) {
            toast.error("Please fill in all required fields.");
            return false;
        }
        if (description.length < 20) {
            toast.error("Description should be at least 20 characters.");
            return false;
        }
        if (!image1 || !image2 || !image3 || !image4) {
            toast.error("Please upload all 4 images.");
            return false;
        }
        return true;
    };

    // handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const formData = new FormData();
            image1 && formData.append("image1", image1);
            image2 && formData.append("image2", image2);
            image3 && formData.append("image3", image3);
            image4 && formData.append("image4", image4);

            Object.entries(form).forEach(([key, value]) => formData.append(key, value));

            if (!token) {
                alert("Token missing! Please login again.");
                setLoading(false);
                return;
            }
            const res = await axios.post(
                backendurl + "/api/listing/add",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (res.data.success) {
                toast.success(res.data.message);
                handleReset();
                getlistingData();
                navigate("/listing", { replace: true });

            } else {
                toast.error(res.data.message);
            }

        } catch (err) {
            console.error("Error:", err);
            toast.error("Failed to add listing");
        } finally {
            setLoading(false);
        }
    };

    // reset everything
    const handleReset = () => {
        setForm({
            title: "",
            description: "",
            category: "",
            location: "",
            country: "",
        });
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setCharCount(0);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <section
                className={`min-h-screen py-10 px-4 md:px-20 transition-colors duration-500 rounded-3xl ${isDark ? "bg-[#0b1120] text-white" : "bg-slate-50 text-gray-900"
                    }`}
            >
                <div className="max-w-4xl mx-auto mb-8 flex items-center gap-3">
                    <NavLink to="/listing">
                        <ArrowLeft
                            size={22}
                            className="text-gray-400 hover:text-blue-400 transition"
                        />
                    </NavLink>
                    <h2 className="text-3xl font-bold">Add New Place</h2>
                </div>

                <motion.form
                    onSubmit={handleSubmit}
                    className={`relative z-10 max-w-4xl mx-auto p-8 mb-10 rounded-2xl shadow-xl border ${isDark
                        ? "bg-[#141b2a] border-[#2a3550]/40 shadow-black/20"
                        : "bg-white border-white/50 shadow-blue-500/5"
                        }`}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Title */}
                    <div className="mb-6">
                        <label className="block font-medium mb-2 text-sm uppercase tracking-wider text-gray-500">
                            Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter the place title"
                            className={`w-full px-4 py-3 rounded-xl border text-base focus:ring-4 outline-none transition-all duration-200 ${isDark
                                ? "bg-[#0f172a] border-gray-700 text-white focus:ring-blue-500/20 focus:border-blue-500"
                                : "bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:ring-blue-500/10 focus:border-blue-500"
                                }`}
                            required
                        />
                    </div>

                    {/* Category & Location */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block font-medium mb-2 text-sm uppercase tracking-wider text-gray-500">
                                Category <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl border text-base appearance-none focus:ring-4 outline-none transition-all duration-200 ${isDark
                                        ? "bg-[#0f172a] border-gray-700 text-white focus:ring-blue-500/20 focus:border-blue-500"
                                        : "bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:ring-blue-500/10 focus:border-blue-500"
                                        }`}
                                    required
                                >
                                    <option value="">Select category</option>
                                    <option value="Cultural">Cultural</option>
                                    <option value="Nature">Nature</option>
                                    <option value="Beach">Beach</option>
                                    <option value="Historical">Historical</option>
                                    <option value="Adventure">Adventure</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block font-medium mb-2 text-sm uppercase tracking-wider text-gray-500">
                                Location <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="e.g., Santorini Island"
                                className={`w-full px-4 py-3 rounded-xl border text-base focus:ring-4 outline-none transition-all duration-200 ${isDark
                                    ? "bg-[#0f172a] border-gray-700 text-white focus:ring-blue-500/20 focus:border-blue-500"
                                    : "bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:ring-blue-500/10 focus:border-blue-500"
                                    }`}
                                required
                            />
                        </div>
                    </div>

                    {/* Country */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block font-medium mb-2 text-sm uppercase tracking-wider text-gray-500">
                                Country <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                                placeholder="e.g., Greece"
                                className={`w-full px-4 py-3 rounded-xl border text-base focus:ring-4 outline-none transition-all duration-200 ${isDark
                                    ? "bg-[#0f172a] border-gray-700 text-white focus:ring-blue-500/20 focus:border-blue-500"
                                    : "bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:ring-blue-500/10 focus:border-blue-500"
                                    }`}
                                required
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6 relative z-10">
                        <label className="block font-medium mb-2 text-sm uppercase tracking-wider text-gray-500">
                            Description <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe the place... (Min 20 chars)"
                            rows="5"
                            maxLength="1000"
                            className={`w-full px-4 py-3 rounded-xl border text-base resize-none focus:ring-4 outline-none transition-all duration-200 ${isDark
                                ? "bg-[#0f172a] border-gray-700 text-white focus:ring-blue-500/20 focus:border-blue-500"
                                : "bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:ring-blue-500/10 focus:border-blue-500"
                                }`}
                            required
                        />
                        <div className={`text-xs text-right mt-1 ${charCount < 20 ? "text-red-400" : "text-gray-500"}`}>
                            {charCount}/1000
                        </div>
                    </div>

                    {/* Image Uploads */}
                    <div className="mb-8 relative z-10">
                        <label className="block font-medium mb-3 text-sm uppercase tracking-wider text-gray-500">
                            Upload 4 Images <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { img: image1, set: setImage1, id: "image1" },
                                { img: image2, set: setImage2, id: "image2" },
                                { img: image3, set: setImage3, id: "image3" },
                                { img: image4, set: setImage4, id: "image4" }
                            ].map((item, idx) => (
                                <label
                                    key={idx}
                                    className={`relative flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 group
                                    ${item.img
                                            ? "border-emerald-400 bg-emerald-50/20"
                                            : isDark
                                                ? "border-gray-700 hover:border-blue-500 hover:bg-gray-800"
                                                : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                                        }`}
                                >
                                    <Upload size={24} className={`mb-2 transition-colors ${item.img ? "text-emerald-500" : "text-gray-400 group-hover:text-blue-500"}`} />
                                    <p className={`text-xs font-medium ${item.img ? "text-emerald-600" : "text-gray-500 group-hover:text-blue-600"}`}>
                                        {item.img ? "Uploaded" : `Image ${idx + 1}`}
                                    </p>
                                    <input
                                        onChange={(e) => item.set(e.target.files[0])}
                                        type="file"
                                        id={item.id}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="text-gray-500 text-sm hover:text-red-500 transition font-medium flex items-center gap-1"
                        >
                            ⟳ Reset
                        </button>

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.02 }}
                            type="submit"
                            disabled={loading}
                            className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {loading ? "Adding..." : "+ Add Place"}
                        </motion.button>
                    </div>
                </motion.form>
            </section>
        </div>
    );
}
