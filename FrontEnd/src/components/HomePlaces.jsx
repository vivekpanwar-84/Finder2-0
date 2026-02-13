import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Places from "./Places";
import { useContext } from "react";
import { ThemeContext } from '../context/ThemeContext'
import { useState, useEffect } from "react";
import Loader from "./Loader";



export default function HomePlaces() {

    const { isDark, averageRating } = useTheme();
    const { demoData, loading } = useContext(ThemeContext);
    const [latestItem, setLatestItem] = useState([]);

    useEffect(() => {
        setLatestItem(demoData.slice(0, 4));
    }, [demoData])




    return (
        loading ? <Loader /> :
            <>
                <section
                    className={`py-12 px-8 transition-colors duration-500 ${isDark ? "bg-[#0a1120] text-white" : "bg-gray-50 text-gray-900"
                        }`}
                >
                    {/* Header */}
                    <div className="pt-1 flex   items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold">Featured Places</h2>
                            <p className="text-gray-400">
                                Discover the most popular destinations
                            </p>
                        </div>
                        <NavLink
                            to="/listing"
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-500 transition"
                        >
                            View All <ArrowRight size={18} />
                        </NavLink>
                    </div>

                    {/* Cards */}
                    {/* <Places /> */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {
                            latestItem.map((item, index) => (
                                <Places key={index} id={item._id} image={item.image} author={item.author} comments={item.comments} description={item.description} country={item.country} averageRating={averageRating} category={item.category} title={item.title} />
                            ))
                        }
                    </div>
                </section>

            </>
    );
}
