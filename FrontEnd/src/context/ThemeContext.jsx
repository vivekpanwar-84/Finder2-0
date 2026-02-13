import { createContext, useContext, useEffect, useState } from "react";
// import places from "../assets/demo";
import axios from "axios";
import { toast } from 'react-toastify';


export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

    const backendurl = import.meta.env.VITE_BACKEND_URL;
    const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");
    const [demoData, setDemoData] = useState([]);

    const [loading, setLoading] = useState(false);

    const toggleTheme = () => setIsDark((prev) => !prev);

    // Apply dark/light class to <html> for Tailwind
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    // Load demo data once
    // useEffect(() => {
    //     setDemoData(places);
    // }, []);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalListings: 0
    });

    const getlistingData = async (page = 1, limit = 8, search = "", category = "", country = "") => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page,
                limit,
                search,
                category,
                country
            }).toString();

            const response = await axios.get(`${backendurl}/api/listing/list?${queryParams}`);

            if (response.data.success) {
                setDemoData(response.data.listings);
                setPagination(response.data.pagination);
            }
            else {
                toast.error('Product Not Found');
            }
        } catch (error) {
            toast.error('Failed to fetch listings');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getlistingData();
        // const interval = setInterval(() => {
        //     getlistingData();
        // }, 1000);

        // return () => clearInterval(interval);

    }
        , [])

    // console.log(demoData)

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme, demoData, getlistingData, loading, pagination }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook
export const useTheme = () => useContext(ThemeContext);
