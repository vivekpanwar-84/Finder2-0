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

    // const [images, setImages] = useState([null, null, null, null]);
    const [image1, setImage1] = useState(false);
    const [image2, setImage2] = useState(false);
    const [image3, setImage3] = useState(false);
    const [image4, setImage4] = useState(false);

    const [charCount, setCharCount] = useState(0);

    // handle text fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (name === "description") setCharCount(value.length);
    };

    // handle image upload
    // const handleImageChange = (index, file) => {
    //     const updated = [...images];
    //     updated[index] = file;
    //     setImages(updated);
    // };

    // handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const formData = new FormData();
            image1 && formData.append("image1", image1);
            image2 && formData.append("image2", image2);
            image3 && formData.append("image3", image3);
            image4 && formData.append("image4", image4);

            Object.entries(form).forEach(([key, value]) => formData.append(key, value));

            console.log("Submitting data:", Object.fromEntries(formData.entries()));

            if (!token) {
                alert("Token missing! Please login again.");
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
            alert("Failed to add listing");
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
        <>
            <div className="w-full pt-23 py-10 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <h1 className="text-4xl font-bold mb-2">Share a New Place</h1>
                <p>Help others discover hidden gems around the world!</p>
            </div>

            <section
                className={`min-h-screen  py-10 px-6 md:px-20 transition-colors duration-500 ${isDark ? "bg-[#0b1120] text-white" : "bg-gray-50 text-gray-900"
                    }`}
            >
                <div className="max-w-4xl mx-auto mb-8 flex items-center gap-3">
                    <NavLink to="/listings">
                        <ArrowLeft
                            size={22}
                            className="text-gray-400 hover:text-blue-400 transition"
                        />
                    </NavLink>
                    <h2 className="text-3xl font-bold">Add New Listing</h2>
                </div>

                <motion.form
                    onSubmit={handleSubmit}
                    className={`relative z-10 max-w-4xl mx-auto p-8 mb-10 rounded-2xl shadow-xl border ${isDark
                        ? "bg-[#141b2a] border-[#2a3550]/40"
                        : "bg-white border-gray-200"
                        }`}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Title */}
                    <div className="mb-6">
                        <label className="block font-medium mb-1">
                            Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter the place title"
                            className={`w-full px-4 py-2 rounded-lg border text-sm focus:ring-2 outline-none ${isDark
                                ? "bg-[#0f172a] border-gray-600 text-white focus:ring-blue-400"
                                : "bg-white border-gray-300 focus:ring-blue-500"
                                }`}
                            required
                        />
                    </div>

                    {/* Category & Location */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block font-medium mb-1">
                                Category <span className="text-red-400">*</span>
                            </label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg border text-sm focus:ring-2 outline-none ${isDark
                                    ? "bg-[#0f172a] border-gray-600 text-white focus:ring-blue-400"
                                    : "bg-white border-gray-300 focus:ring-blue-500"
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
                        </div>

                        <div>
                            <label className="block font-medium mb-1">
                                Location <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="e.g., Santorini Island"
                                className={`w-full px-4 py-2 rounded-lg border text-sm focus:ring-2 outline-none ${isDark
                                    ? "bg-[#0f172a] border-gray-600 text-white focus:ring-blue-400"
                                    : "bg-white border-gray-300 focus:ring-blue-500"
                                    }`}
                                required
                            />
                        </div>
                    </div>

                    {/* Country & Author */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block font-medium mb-1">
                                Country <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                                placeholder="e.g., Greece"
                                className={`w-full px-4 py-2 rounded-lg border text-sm focus:ring-2 outline-none ${isDark
                                    ? "bg-[#0f172a] border-gray-600 text-white focus:ring-blue-400"
                                    : "bg-white border-gray-300 focus:ring-blue-500"
                                    }`}
                                required
                            />
                        </div>

                        {/* <div>
                            <label className="block font-medium mb-1">
                                Author ID <span className="text-red-400">*</span>
                            </label>
                            <input
                                placeholder="e.g., Valentino"
                                className={`w-full px-4 py-2 rounded-lg border text-sm focus:ring-2 outline-none ${isDark
                                    ? "bg-[#0f172a] border-gray-600 text-white focus:ring-blue-400"
                                    : "bg-white border-gray-300 focus:ring-blue-500"
                                    }`}
                                
                            />
                        </div> */}
                    </div>

                    {/* Description */}
                    <div className="mb-6 relative z-10">
                        <label className="block font-medium mb-1">
                            Description <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe the place..."
                            rows="5"
                            maxLength="1000"
                            className={`w-full px-4 py-3 rounded-lg border text-sm resize-none focus:ring-2 outline-none ${isDark
                                ? "bg-[#0f172a] border-gray-600 text-white focus:ring-blue-400"
                                : "bg-white border-gray-300 focus:ring-blue-500"
                                }`}
                            required
                        />
                        <div className="text-xs text-gray-500 text-right">
                            {charCount}/1000
                        </div>
                    </div>

                    {/* Image Uploads */}
                    <div className="mb-8 relative z-10">
                        <label className="block font-medium mb-3">
                            Upload 4 Images <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                            <label

                                className={`relative flex flex-col items-center justify-center h-28 border-2 border-dashed rounded-lg cursor-pointer transition ${image1 ? "border-green-400 bg-green-50" : "border-gray-300"
                                    }`}
                            >
                                <Upload size={22} className="text-gray-400" />
                                <p className="text-xs text-gray-500 mt-2">
                                    {image1 ? "Uploaded ✅" : "Click to Upload"}
                                </p>
                                <input
                                    onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1"
                                    className="hidden"
                                />
                            </label>
                            <label

                                className={`relative flex flex-col items-center justify-center h-28 border-2 border-dashed rounded-lg cursor-pointer transition ${image2 ? "border-green-400 bg-green-50" : "border-gray-300"
                                    }`}
                            >
                                <Upload size={22} className="text-gray-400" />
                                <p className="text-xs text-gray-500 mt-2">
                                    {image2 ? "Uploaded ✅" : "Click to Upload"}
                                </p>
                                <input
                                    onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2"
                                    className="hidden"
                                />
                            </label>
                            <label

                                className={`relative flex flex-col items-center justify-center h-28 border-2 border-dashed rounded-lg cursor-pointer transition ${image3 ? "border-green-400 bg-green-50" : "border-gray-300"
                                    }`}
                            >
                                <Upload size={22} className="text-gray-400" />
                                <p className="text-xs text-gray-500 mt-2">
                                    {image3 ? "Uploaded ✅" : "Click to Upload"}
                                </p>
                                <input
                                    onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3"
                                    className="hidden"
                                />
                            </label>
                            <label

                                className={`relative flex flex-col items-center justify-center h-28 border-2 border-dashed rounded-lg cursor-pointer transition ${image4 ? "border-green-400 bg-green-50" : "border-gray-300"
                                    }`}
                            >
                                <Upload size={22} className="text-gray-400" />
                                <p className="text-xs text-gray-500 mt-2">
                                    {image4 ? "Uploaded ✅" : "Click to Upload"}
                                </p>
                                <input
                                    onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4"
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="text-gray-400 text-sm hover:text-red-400 transition"
                        >
                            ⟳ Reset Form
                        </button>

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition"
                        >
                            + Add Listing
                        </motion.button>
                    </div>
                </motion.form>
            </section>
        </>
    );
}
