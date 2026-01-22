import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Upload } from "lucide-react";
import { useTheme, ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";

export default function EditListingForm() {
    const backendurl = import.meta.env.VITE_BACKEND_URL;
    const { isDark } = useTheme();
    const { getlistingData } = useContext(ThemeContext); // refresh listings after edit
    const { listId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
        location: "",
        country: "",
    });

    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [image4, setImage4] = useState(null);
    const [oldImages, setOldImages] = useState([]);
    const [charCount, setCharCount] = useState(0);

    // Fetch existing listing
    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await axios.get(backendurl + `/api/listing/${listId}`);
                const data = res.data;
                setForm({
                    title: data.title,
                    description: data.description,
                    category: data.category,
                    location: data.location,
                    country: data.country,
                });
                setOldImages(data.image || []);
                setCharCount(data.description?.length || 0);
            } catch (err) {
                toast.error("Failed to load listing");
            }
        };
        fetchListing();
    }, [listId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (name === "description") setCharCount(value.length);
    };

    const handleImageChange = (setter) => (e) => {
        setter(e.target.files[0]);
    };

    const handleReset = () => {
        setForm({
            title: "",
            description: "",
            category: "",
            location: "",
            country: "",
        });
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
        setOldImages([]);
        setCharCount(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => formData.append(key, value));
            if (image1) formData.append("image1", image1);
            if (image2) formData.append("image2", image2);
            if (image3) formData.append("image3", image3);
            if (image4) formData.append("image4", image4);

            const res = await axios.put(
                backendurl + `/api/listing/${listId}/edit`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (res.data.success) {
                toast.success("Listing updated successfully!");
                getlistingData(); // refresh list in context
                navigate(`/listing/${listId}`, { replace: true });
            } else {
                toast.error("Failed to update listing");
            }
        } catch (err) {
            toast.error("Failed to update listing");
            console.error(err);
        }
    };

    return (
        <section
            className={`mt-15 min-h-screen py-10 px-6 md:px-20 transition-colors duration-500 ${isDark ? "bg-[#0b1120] text-white" : "bg-gray-50 text-gray-900"
                }`}
        >
            <div className="max-w-4xl mx-auto mb-8 flex items-center gap-3">
                <NavLink to="/listings">
                    <ArrowLeft size={22} className="text-gray-400 hover:text-blue-400 transition" />
                </NavLink>
                <h2 className="text-3xl font-bold">Edit Listing</h2>
            </div>

            <motion.form
                onSubmit={handleSubmit}
                className={`relative z-10 max-w-4xl mx-auto p-8 mb-10 rounded-2xl shadow-xl border ${isDark ? "bg-[#141b2a] border-[#2a3550]/40" : "bg-white border-gray-200"
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
                            placeholder="Enter location"
                            className={`w-full px-4 py-2 rounded-lg border text-sm focus:ring-2 outline-none ${isDark
                                ? "bg-[#0f172a] border-gray-600 text-white focus:ring-blue-400"
                                : "bg-white border-gray-300 focus:ring-blue-500"
                                }`}
                            required
                        />
                    </div>
                </div>

                {/* Country */}
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
                            placeholder="Enter country"
                            className={`w-full px-4 py-2 rounded-lg border text-sm focus:ring-2 outline-none ${isDark
                                ? "bg-[#0f172a] border-gray-600 text-white focus:ring-blue-400"
                                : "bg-white border-gray-300 focus:ring-blue-500"
                                }`}
                            required
                        />
                    </div>
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
                    <div className="text-xs text-gray-500 text-right">{charCount}/1000</div>
                </div>

                {/* Old Images */}
                <div className="mb-6">
                    <p className="text-sm font-semibold">Old Images:<span className="text-red-500">  (Note: When you update images, all previously uploaded images will be removed.)</span></p>
                    <div className="flex gap-3 mt-2">
                        {oldImages.map((img, i) => (
                            <img key={i} src={img} alt="old" className="w-20 h-20 object-cover rounded" />
                        ))}
                    </div>
                </div>

                {/* Image Uploads */}
                <div className="mb-8 relative z-10">
                    <label className="block font-medium mb-3">Upload 4 Images</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[image1, image2, image3, image4].map((img, i) => (
                            <label
                                key={i}
                                className={`relative flex flex-col items-center justify-center h-28 border-2 border-dashed rounded-lg cursor-pointer transition ${img ? "border-green-400 bg-green-50" : "border-gray-300"
                                    }`}
                            >
                                <Upload size={22} className="text-gray-400" />
                                <p className="text-xs text-gray-500 mt-2">{img ? "Uploaded ✅" : "Click to Upload"}</p>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleImageChange([setImage1, setImage2, setImage3, setImage4][i])}
                                />
                            </label>
                        ))}
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
                        Update Listing
                    </motion.button>
                </div>
            </motion.form>
        </section>
    );
}
