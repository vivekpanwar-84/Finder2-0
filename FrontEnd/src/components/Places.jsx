import React from 'react'
import { motion } from "framer-motion";
import { MapPin, MessageCircle, Star, UserRoundPen } from "lucide-react";
import { useTheme } from '../context/ThemeContext'
import { Link } from 'react-router-dom';

const Places = ({ id, image, author, comments, description, country, rating, category, title }) => {
    const { isDark } = useTheme();


    return (
        <Link to={`/listing/${id}`}>
            <div className='mb-10'>

                <motion.div

                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0 }}
                    whileHover={{
                        scale: 1.02,
                        y: -5,
                        boxShadow: isDark ? "0 20px 40px -15px rgba(0,0,0,0.5)" : "0 20px 40px -15px rgba(59, 130, 246, 0.15)",
                    }}
                    className={`rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border ${isDark
                        ? "bg-[#141b2a] border-gray-800"
                        : "bg-white border-white shadow-blue-500/5"
                        } transition-all duration-300 group`}
                >
                    {/* Image */}
                    <div className="relative">
                        <img
                            src={image[0]}
                            alt={title}
                            className="h-48 w-full object-cover"
                        />
                        <span className="absolute top-3 left-3 bg-gradient-to-r from-purple-400 to-blue-400 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            {category}
                        </span>
                        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                            <Star size={12} className="text-yellow-400" /> {rating}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col justify-between h-45 ">
                        <div>
                            <h3 className="text-lg font-semibold mb-1 line-clamp-1">
                                {title}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                                <MapPin size={14} /> {country}
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                {description}
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <MessageCircle size={14} /> {comments}
                            </div>
                            <div className="flex items-center gap-2">
                                <UserRoundPen size={14} /> {author}
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>

        </Link>
    )
}

export default Places
