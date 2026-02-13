
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { Star, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import ConfirmModal from "./ConfirmModal";
import { useAuth } from "../context/AuthContext";

export default function Comment({ listingId }) {
    const { getlistingData } = useContext(ThemeContext);
    const { isDark } = useTheme();
    const { user } = useAuth(); // Use useAuth for user context consistency

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [rating, setRating] = useState("");
    const [review, setReview] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);
    const maxChars = 500;

    const backendurl = import.meta.env.VITE_BACKEND_URL;

    const fetchReviews = async () => {
        try {
            const res = await axios.get(backendurl + `/api/review/${listingId}`);
            if (res.data.success) setReviews(res.data.reviews);
            else setReviews([]);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fallback to localStorage if useAuth doesn't provide it immediately or for consistency
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser._id) setCurrentUserId(storedUser._id);
        else if (user && user._id) setCurrentUserId(user._id);
    }, [user]);


    const handleDelete = async (reviewId) => {
        try {
            const res = await axios.delete(backendurl + `/api/review/${reviewId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (res.data.success) {
                setReviews(reviews.filter((r) => r._id !== reviewId));
                toast.success("Review deleted successfully!");
                getlistingData();
            } else toast.error(res.data.message);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (listingId) fetchReviews();
    }, [listingId]);



    // add review submission form here
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rating || !review.trim()) return;

        const token = localStorage.getItem("token"); // get logged-in user token
        if (!token) {
            toast.error("Please login to submit a review.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(
                backendurl + `/api/review/${listingId}`,
                {
                    rating: Number(rating),
                    comment: review.trim(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data.success) {
                // Reset form
                setRating("");
                setReview("");
                // Call parent callback to refresh review list
                fetchReviews();
                toast.success("Review submitted successfully!");
                getlistingData();

            } else {
                alert(res.data.message);
            }
        } catch (err) {
            console.error("Error submitting review:", err);
            toast.error("Something went wrong while submitting your review.");
        } finally {
            setLoading(false);
        }
    };

    return (<>
        {/* form Start  */}
        <div className="mt-10 mb-5 ">
            <form
                onSubmit={handleSubmit}
                className={`w-full max-w-3xl ${isDark
                    ? "bg-gray-900 border border-gray-600 text-white"
                    : "bg-white border border-gray-600 text-gray-900"
                    } rounded-lg p-8 shadow-md`}
            >
                <h2 className="text-2xl font-semibold mb-6">Share Your Experience</h2>

                <label className="block text-sm font-medium mb-2">
                    Your Rating <span className="text-red-500">*</span>
                </label>

                <div className="mb-6">
                    <select
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="w-full text-black border bg-white rounded-md px-4 py-3 shadow-sm focus:outline-none"
                    >
                        <option value="">Select a rating</option>
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Very Good</option>
                        <option value="3">3 - Good</option>
                        <option value="2">2 - Fair</option>
                        <option value="1">1 - Poor</option>
                    </select>
                </div>

                <label className="block text-sm font-medium mb-2">
                    Your Review <span className="text-red-500">*</span>
                </label>

                <div className="mb-2">
                    <textarea
                        value={review}
                        onChange={(e) => {
                            if (e.target.value.length <= maxChars) setReview(e.target.value);
                        }}
                        placeholder="Share your thoughts about this place. What did you like? What should others know?"
                        className={`w-full h-40 rounded-md border border-[#2b3b48] ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
                            } px-4 py-4 placeholder:text-[#5b6b78] text-[#cbd5e1] resize-none focus:outline-none`}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm text-[#98a1ad]">
                        {review.length}/{maxChars} characters
                    </div>

                    <button
                        type="submit"
                        disabled={!rating || !review.trim() || loading}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium shadow-sm transition-opacity disabled:opacity-50 disabled:cursor-not-allowed bg-[#2b5aa6]`}
                    >
                        <span>{loading ? "Submitting..." : "Submit Review"}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 19l9-7-9-7-3 6-6 1 9 7z"
                            />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
        {/* form End  */}

        <div className="space-y-4">
            {loading && <p className="text-gray-500 animate-pulse">Loading reviews...</p>}
            {!loading && reviews.length === 0 && <p>No reviews yet.</p>}
            {reviews.map((review) => (
                <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg shadow-md flex justify-between items-start ${isDark ? "bg-[#141b2a] text-white" : "bg-white text-gray-900"}`}
                >
                    <div className="flex-1">
                        <p className="font-semibold">{review.author.name}</p>
                        <div className="flex items-center mb-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={16} className={i < review.rating ? "text-yellow-400" : "text-gray-400"} />
                            ))}
                        </div>
                        <p className="text-sm">{review.comment}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleString()}</p>
                    </div>
                    {/* Only show delete button if current user is the author */}
                    {review.author._id === currentUserId && (
                        <button
                            onClick={() => {
                                setReviewToDelete(review._id);
                                setShowDeleteModal(true);
                            }}
                            className="text-red-500 hover:text-red-700 ml-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                </motion.div>
            ))}
        </div>

        <ConfirmModal
            isOpen={showDeleteModal}
            onClose={() => {
                setShowDeleteModal(false);
                setReviewToDelete(null);
            }}
            onConfirm={() => {
                if (reviewToDelete) {
                    handleDelete(reviewToDelete);
                }
                setShowDeleteModal(false);
                setReviewToDelete(null);
            }}
            title="Delete Review?"
            message="Are you sure you want to delete your review? This action cannot be undone."
            isDark={isDark}
        />
    </>
    );
}
