import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Mail, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import ConfirmModal from '../components/ConfirmModal';
import { toast } from 'react-toastify';

const Profile = () => {
    const { user, token } = useAuth();
    const { isDark } = useTheme();
    const [profileData, setProfileData] = useState(null);
    const [userListings, setUserListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [listingToDelete, setListingToDelete] = useState(null);
    const backendurl = import.meta.env.VITE_BACKEND_URL;

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchProfileAndListings = async () => {
            try {
                // Fetch Profile
                const profileRes = await axios.get(`${backendurl}/api/user/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (profileRes.data.success) {
                    setProfileData(profileRes.data.user);
                }

                // Fetch User Listings
                const listingRes = await axios.get(`${backendurl}/api/listing/user/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (listingRes.data.success) {
                    setUserListings(listingRes.data.listings);
                }

            } catch (error) {
                console.error("Error fetching data:", error);
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfileAndListings();
    }, [token, backendurl, navigate]);


    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(backendurl + `/api/listing/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) {
                toast.success("Listing deleted successfully!");
                setUserListings(userListings.filter(item => item._id !== id));
            } else toast.error(res.data.message);
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete listing");
        }
    };


    if (loading) return <Loader />;

    return (
        <div className={`min-h-screen pt-24 px-4 sm:px-8 ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">User Profile</h1>

                {profileData ? (
                    <>
                        <div className={`rounded-2xl p-8 shadow-lg mb-10 ${isDark ? "bg-[#141b2a]" : "bg-white"}`}>
                            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                                {/* Avatar Placeholder */}
                                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-4xl font-bold text-white shadow-xl">
                                    {profileData.name ? profileData.name.charAt(0).toUpperCase() : <User />}
                                </div>

                                {/* Info */}
                                <div className="flex-1 w-full text-center md:text-left">
                                    <h2 className="text-2xl font-bold mb-2">{profileData.name}</h2>
                                    <p className={`text-sm mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                        Member since {new Date(profileData.createdAt || Date.now()).toLocaleDateString()}
                                    </p>

                                    <div className="grid gap-4 max-w-md mx-auto md:mx-0">
                                        <div className={`flex items-center gap-3 p-3 rounded-lg ${isDark ? "bg-gray-800/50" : "bg-gray-50"}`}>
                                            <Mail className="text-blue-500 w-5 h-5" />
                                            <span>{profileData.email}</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                        <NavLink
                                            to="/addnewplace"
                                            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
                                        >
                                            <PlusCircle size={20} />
                                            Add New Place
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Listings Section */}
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold mb-6">My Listings</h2>
                            {userListings.length > 0 ? (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {userListings.map((listing) => (
                                        <div key={listing._id} className={`rounded-xl overflow-hidden shadow-lg ${isDark ? "bg-[#141b2a]" : "bg-white"}`}>
                                            <img src={listing.image[0]} alt={listing.title} className="w-full h-48 object-cover" />
                                            <div className="p-5">
                                                <h3 className="text-xl font-bold mb-2 truncate">{listing.title}</h3>
                                                <p className={`text-sm mb-4 line-clamp-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                                    {listing.description}
                                                </p>
                                                <div className="flex gap-3 mt-4">
                                                    <NavLink
                                                        to={`/listing/${listing._id}/edit`}
                                                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition"
                                                    >
                                                        <Edit size={16} /> Edit
                                                    </NavLink>
                                                    <button
                                                        onClick={() => {
                                                            setListingToDelete(listing._id);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition"
                                                    >
                                                        <Trash2 size={16} /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">You haven't added any places yet.</p>
                            )}
                        </div>

                        <ConfirmModal
                            isOpen={showDeleteModal}
                            onClose={() => {
                                setShowDeleteModal(false);
                                setListingToDelete(null);
                            }}
                            onConfirm={() => {
                                if (listingToDelete) handleDelete(listingToDelete);
                                setShowDeleteModal(false);
                                setListingToDelete(null);
                            }}
                            title="Delete Listing?"
                            message="Are you sure you want to delete this listing? This action cannot be undone."
                            isDark={isDark}
                        />

                    </>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl">Please log in to view your profile.</p>
                        <NavLink to="/login" className="mt-4 inline-block text-blue-500 hover:underline">Go to Login</NavLink>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
