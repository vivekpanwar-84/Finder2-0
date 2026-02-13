import { motion } from "framer-motion";
import { Lock, Users, Globe2, MapPin, Star, Heart, TrendingUp } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function About() {
  const { isDark } = useTheme();

  return (
    <>
      {/* <div className="p-4 sm:p-6 lg:p-8">
        <div className=" w-full pt-15 h-50 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl">
          <span className="text-5xl font-bold ">About Finder.</span>
          <div className="">Access your travel community and continue discovering amazing places
            <div> shared by fellow travelers.</div>
          </div>
        </div>
      </div> */}
      <section

        className={`  min-h-screen flex items-center justify-center px-4 py-10 transition-colors duration-500 ${isDark ? "bg-[#0b1120] text-white" : "bg-gray-50 text-gray-900"
          }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`w-full max-w-2xl rounded-2xl shadow-xl border p-10 ${isDark
            ? "bg-[#141b2a] border-[#2a3550]/40"
            : "bg-white border-gray-200"
            }`}
        >


          {/* Icons Row */}
          <div className="flex justify-center gap-6 text-sm text-gray-400 mb-10">
            <div className="flex items-center gap-2">
              <Lock size={16} className="text-blue-400" />
              <span>Secure Login</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-purple-400" />
              <span>Join 10K+ Travelers</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe2 size={16} className="text-green-400" />
              <span>Worldwide Community</span>
            </div>
          </div>

          {/* Why Join Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Why Join Finder.?</h3>
            <p className="text-gray-400 text-sm mb-6">
              Become part of a global community that shares authentic travel experiences.
            </p>

            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="text-blue-400 mt-1" size={18} />
                <div>
                  <p className="font-medium">Share Your Places</p>
                  <p className="text-gray-400">
                    Add your favorite travel destinations and help others discover hidden gems around the world.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Star className="text-yellow-400 mt-1" size={18} />
                <div>
                  <p className="font-medium">Rate & Review</p>
                  <p className="text-gray-400">
                    Leave honest reviews and ratings to guide fellow travelers in their journey planning.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Users className="text-purple-400 mt-1" size={18} />
                <div>
                  <p className="font-medium">Connect with Travelers</p>
                  <p className="text-gray-400">
                    Join a community of passionate travelers and exchange experiences and recommendations.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Heart className="text-pink-400 mt-1" size={18} />
                <div>
                  <p className="font-medium">Save Favorites</p>
                  <p className="text-gray-400">
                    Bookmark places you want to visit and create your personal travel wishlist.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Community Stats */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
            className={`rounded-xl p-6 mt-6 ${isDark ? "bg-[#1c2338]" : "bg-blue-50 border border-blue-100"
              }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="text-blue-500" />
              <p className="font-semibold">Growing Community</p>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Join thousands of travelers who have already shared over 50,000 amazing places worldwide.
            </p>

            <div className="grid grid-cols-3 text-center text-sm font-medium">
              <div>
                <p className="text-xl font-bold text-blue-500">10K+</p>
                <p className="text-gray-400">Active Users</p>
              </div>
              <div>
                <p className="text-xl font-bold text-blue-500">50K+</p>
                <p className="text-gray-400">Places Shared</p>
              </div>
              <div>
                <p className="text-xl font-bold text-blue-500">180+</p>
                <p className="text-gray-400">Countries</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
