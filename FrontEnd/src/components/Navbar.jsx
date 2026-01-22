import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { Sun, Moon, Menu, MapPinPlus } from "lucide-react";

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const { isDark, toggleTheme } = useTheme();
    const { isAuthenticated, logout } = useAuth();

    // const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        // navigate("/login");
    };


    return (
        <nav
            className={`fixed  top-0 left-0 w-full z-50 flex  items-center justify-between py-4 px-6 sm:px-10 font-medium transition-colors duration-300 
        ${isDark ? "bg-gray-900 border-b-1 border-gray-600 text-white" : "bg-white text-gray-900 border-b-1 border-gray-500"}
      `}
        >
            {/* Brand */}
            <NavLink to="/" className="text-3xl text-blue-400 font-bold cursor-pointer">
                FINDER<span className="text-blue-400 cursor-pointer">.</span>
            </NavLink>



            {/* Desktop Menu */}
            <ul className="hidden sm:flex gap-8 text-sm">
                {["Home", "Listing", "About", "AddNewPlace"].map((item, idx) => (
                    <NavLink
                        key={idx}
                        to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 transition ${isActive ? "text-blue-500" : "hover:text-blue-500"
                            }`
                        }
                    >
                        {/* {
                            item === "addNewPlace" ? <MapPinPlus className="w-3 h-5" /> : <p>{item}</p>
                    } */}
                        <p>{item}</p>
                        <hr className="w-2/4 border-none h-[1.5px] bg-blue-500 hidden group-hover:block" />
                    </NavLink>
                ))}
            </ul>

            {/* Right Buttons */}
            <div className="hidden sm:flex items-center gap-4">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-400 transition"
                >
                    {isDark ? (
                        <Sun className="w-5 h-5 text-yellow-300 cursor-pointer" />
                    ) : (
                        <Moon className="w-5 h-5 text-gray-800 cursor-pointer" />
                    )}
                </button>

                {/* Login Button */}
                {isAuthenticated ? (
                    <button
                        onClick={handleLogout}
                        className="px-5 py-2 border border-gray-600 rounded hover:bg-black hover:text-white transition cursor-pointer"
                    >
                        Logout
                    </button>
                ) : (
                    <>
                        <NavLink
                            to="/login"
                            className="px-5 py-2 border border-gray-600 rounded hover:bg-black hover:text-white transition cursor-pointer"
                        >
                            SignIn
                        </NavLink>
                        <NavLink to="/login" className={` px-5 py-2 ${isDark ? "bg-red-700 text-white" : ""}

                     border border-gray-600  rounded hover:bg-gray-700 hover:text-white transition cursor-pointer`}>
                            SignUp
                        </NavLink>
                    </>
                )}



                {/* Mobile Menu Icon */}

            </div>


            <Menu
                className="cursor-pointer text-xl sm:hidden"
                onClick={() => setVisible(true)}
            />
            {/* Sidebar Menu (Mobile) */}
            <div
                className={`fixed top-0 right-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out shadow-xl 
          ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-800"} 
          ${visible ? "translate-x-0" : "translate-x-full"}
        `}
            >


                <div className="flex flex-col h-full p-5">
                    <div className="flex justify-between items-center ">

                        <button
                            onClick={toggleTheme}
                            className=" rounded-full hover:bg-gray-200 dark:hover:bg-gray-400 transition"
                        >
                            {isDark ? (
                                <Sun className="w-5 h-5 text-yellow-300 cursor-pointer" />
                            ) : (
                                <Moon className="w-5 h-5 text-gray-800 cursor-pointer" />
                            )}
                        </button>
                        <button
                            className="self-end text-2xl mb-6"
                            onClick={() => setVisible(false)}
                        >
                            ✕
                        </button>
                    </div>



                    {["Home", "Listings", "AddNewPlace", "About", "Contacts",].map((item, idx) => (
                        <NavLink
                            key={idx}
                            to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                            className="py-2 hover:text-blue-500"
                            onClick={() => setVisible(false)}
                        >
                            {item}
                        </NavLink>
                    ))}
                    {isAuthenticated ? (
                        <p
                            onClick={handleLogout}
                            className="py-2 hover:text-blue-500"
                        >
                            Logout
                        </p>
                    ) : (
                        <>
                            <NavLink
                                to="/login"
                                className="py-2 hover:text-blue-500"
                            >
                                Login
                            </NavLink>
                            {/* <NavLink to="/login" className="py-2 hover:text-blue-500">
                            SignUp
                        </NavLink> */}
                        </>
                    )}
                </div>
            </div>

            {/* Overlay when sidebar is open */}
            {visible && (
                <div
                    className="fixed inset-0 bg-black/40 z-40"
                    onClick={() => setVisible(false)}
                ></div>
            )}
        </nav>
    );
};

export default Navbar;  