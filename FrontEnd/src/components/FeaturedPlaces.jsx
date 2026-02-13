import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Places from "./Places";
import { useContext, useEffect } from "react";
import { ThemeContext } from '../context/ThemeContext'
import { useSearchParams } from "react-router-dom";
import Loader from "./Loader";

export default function FeaturedPlaces() {
    const { isDark } = useTheme();
    const { demoData, loading, pagination, getlistingData } = useContext(ThemeContext);

    // URL Search Params for persistence
    const [searchParams, setSearchParams] = useSearchParams();

    // Derived state from URL or default to empty
    const searchTerm = searchParams.get("search") || "";
    const categoryFilter = searchParams.get("category") || "";
    const countryFilter = searchParams.get("country") || "";
    const currentPageParam = searchParams.get("page") || "1";

    // Debounce search and handle filter changes
    useEffect(() => {
        const timer = setTimeout(() => {
            getlistingData(parseInt(currentPageParam), 8, searchTerm, categoryFilter, countryFilter);
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [searchTerm, categoryFilter, countryFilter, currentPageParam]);

    // Update URL params
    const updateParams = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }

        // If searching or filtering, reset to page 1 (unless we are just changing the page)
        if (key !== "page") {
            newParams.set("page", "1");
        }

        setSearchParams(newParams);
    };

    const handleClear = () => {
        setSearchParams({});
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <div className={`flex justify-center p-4 sm:p-6 ${isDark ? "bg-[#0a1120] text-white" : "bg-gray-50 text-gray-900"}`}>
                <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-5xl rounded-2xl px-4 py-4 shadow-md border ${isDark ? "bg-[#0a1120] text-white" : "bg-gray-50 text-gray-900"} transition-all duration-300`}>
                    {/* Search Input */}
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => updateParams("search", e.target.value)}
                        placeholder="Search places by name or description..."
                        className={`flex-1 ${isDark ? "bg-[#0a1120] text-white" : "bg-gray-50 text-gray-900"} text-gray-300 placeholder-gray-500 text-sm px-4 py-2 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 w-full`}
                    />

                    {/* Category Dropdown */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => updateParams("category", e.target.value)}
                        className="bg-white text-gray-700 text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-40"
                    >
                        <option value="">Category</option>
                        <option value="beach">Beaches</option>
                        <option value="Mountains">Mountains</option>
                        <option value="city">Cities</option>
                        <option value="Parks">Parks</option>
                        <option value="Jungle Safari">Jungle Safari</option>
                        <option value="desert">Deserts</option>
                        <option value="Spiritual">Spiritual</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Nature">Nature</option>
                        <option value="Wildlife">Wildlife</option>
                        <option value="Romantic">Romantic</option>
                        <option value="Family">Family</option>
                        <option value="Historical">Historical</option>
                        <option value="Adventure">Adventure</option>
                    </select>

                    {/* Country Dropdown */}
                    <select
                        value={countryFilter}
                        onChange={(e) => updateParams("country", e.target.value)}
                        className="bg-white text-gray-700 text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-40"
                    >
                        <option value="">Country</option>
                        <option value="india">India</option>
                        <option value="United States">USA</option>
                        <option value="Tanzania">Tanzania</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="Fiji">Fiji</option>
                        <option value="Indonesia">Indonesia</option>
                    </select>

                    {/* Clear Button */}
                    <button
                        onClick={handleClear}
                        className="flex items-center justify-center gap-1 text-sm text-gray-400 hover:text-red-500 transition ml-0 sm:ml-2 w-full sm:w-auto py-2"
                    >
                        <X size={14} /> Clear
                    </button>
                </div>
            </div>

            <section className={`py-1 px-8 transition-colors duration-500 ${isDark ? "bg-[#0a1120] text-white" : "bg-gray-50 text-gray-900"}`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold">All Places</h2>
                        <p className="text-gray-400">Discover the most popular destinations</p>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
                    {demoData.length > 0 ? (
                        demoData.map((item, index) => (
                            <Places
                                key={index}
                                id={item._id}
                                image={item.image}
                                author={item.owner?.name || "Unknown"}
                                comments={item.reviews?.length || 0}
                                description={item.description}
                                country={item.country}
                                rating={item.ratings}
                                category={item.category}
                                title={item.title}
                            />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-400 py-10">
                            No places found.
                        </p>
                    )}
                </div>

                {/* Pagination Controls */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8 pb-8">
                        <button
                            onClick={() => {
                                if (pagination.currentPage > 1) {
                                    updateParams("page", pagination.currentPage - 1);
                                    window.scrollTo(0, 0);
                                }
                            }}
                            disabled={pagination.currentPage === 1}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${pagination.currentPage === 1
                                ? "opacity-50 cursor-not-allowed text-gray-400"
                                : isDark
                                    ? "bg-gray-800 text-white hover:bg-gray-700"
                                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-blue-600"
                                }`}
                        >
                            <ChevronLeft size={20} />
                            Previous
                        </button>

                        <span className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </span>

                        <button
                            onClick={() => {
                                if (pagination.currentPage < pagination.totalPages) {
                                    updateParams("page", pagination.currentPage + 1);
                                    window.scrollTo(0, 0);
                                }
                            }}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${pagination.currentPage === pagination.totalPages
                                ? "opacity-50 cursor-not-allowed text-gray-400"
                                : isDark
                                    ? "bg-gray-800 text-white hover:bg-gray-700"
                                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-blue-600"
                                }`}
                        >
                            Next
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </section>
        </>
    );
}
