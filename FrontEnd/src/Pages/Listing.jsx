import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { ThemeContext, useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { MapPin, Layers, Star, Earth, UserRoundPen } from "lucide-react";
import Comment from "../components/Comment";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import ConfirmModal from "../components/ConfirmModal";


const Listing = () => {
  const { listId } = useParams();
  const { demoData, loading } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const { isDark, getlistingData } = useTheme();
  const { user, token } = useAuth();
  const [averageRating, setAverageRating] = useState(0);
  const [mainImage, setMainImage] = useState("");
  const backendurl = import.meta.env.VITE_BACKEND_URL;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);


  // Fetch the listing from demoData
  useEffect(() => {
    if (demoData && demoData.length > 0) {
      const foundItem = demoData.find((item) => String(item._id) === listId);
      setData(foundItem || null);
    }
  }, [listId, demoData]);

  //  Compute average rating whenever data changes
  useEffect(() => {
    if (data && data.reviews && data.reviews.length > 0) {
      const ratings = data.reviews.map((r) => r.rating || 0);
      const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
      setAverageRating(Math.round(avg * 2) / 2);
    } else {
      setAverageRating(0);
    }
  }, [data]);

  // Check if current user is following the listing owner
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (user && data?.owner?._id) {
        try {
          const res = await axios.get(backendurl + '/api/user/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data.success) {
            const isFound = res.data.user.following.some(id => id === data.owner._id || id._id === data.owner._id);
            setIsFollowing(isFound);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    if (token) checkFollowStatus();
  }, [user, data, token, backendurl]);

  const handleFollow = async () => {
    if (!user) {
      toast.error("Please login to follow");
      navigate("/login");
      return;
    }
    if (user._id === data.owner._id) {
      toast.error("You cannot follow yourself");
      return;
    }
    try {
      setFollowLoading(true);
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      const res = await axios.post(`${backendurl}/api/user/${endpoint}/${data.owner._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setIsFollowing(!isFollowing);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setFollowLoading(false);
    }
  };


  const handleDelete = async (deleteId) => {
    try {
      const res = await axios.delete(backendurl + `/api/listing/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        toast.success("Listing deleted successfully!");
        getlistingData();
        navigate("/listing");

      } else toast.error(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };


  const stars = Array(5)
    .fill(0)
    .map((_, i) => (
      <Star
        key={i}
        size={20}
        className={
          i < Math.floor(averageRating)
            ? "text-yellow-400 fill-yellow-400"
            : i + 0.5 === averageRating
              ? "text-yellow-400 fill-yellow-400/60"
              : "text-gray-600"
        }
      />
    ));

  if (loading || !data) {
    return <Loader />;
  }

  return (
    <div
      className={`pt-25 min-h-screen justify-center ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-600"
        } text-gray-300 px-4 sm:px-8 py-10`}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className={`flex items-center gap-2 text-sm text-gray-300 ${isDark
          ? "bg-gray-900 text-white border border-gray-500 hover:bg-blue-400"
          : "bg-white border border-gray-300 text-gray-900 hover:bg-blue-400"
          } px-4 py-2 rounded-lg mb-8 transition`}
      >
        ← Back to Places
      </button>


      {/* Image + Details */}

      <div className="ml-5 sm:flex w-full max-w-5xl mx-auto">
        <div className="flex sm:flex-col">
          {data.image.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`thumb-${i}`}
              className={`p-2 mb-3 mr-10 h-12  sm:h-20 w-20 rounded-lg cursor-pointer border ${mainImage === img
                ? "border-black dark:border-blue-400"
                : "border-gray-300 dark:border-gray-700"
                }`}
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>

        {data.image && data.image.length > 0 && (
          <img
            src={mainImage || data.image[0]}
            alt={data.title}
            className="rounded-xl shadow-lg w-90 h-70  sm:h-90 sm:w-150 sm:ml-5 "
          />
        )}


        {/* Title & Info */}
        <div className="ml-5 mt-2  sm:px-0">

          <h1 className="text-3xl sm:text-4xl font-bold">{data.title}</h1>

          {/* ⭐ Rating */}
          <div className="flex items-center gap-1 mt-3">
            {stars}
            <span className="ml-2 text-sm">
              {averageRating.toFixed(1)} ({data.reviews?.length || 0} reviews)
            </span>
          </div>

          {/* 📍 Category & Country */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
            <span className="flex items-center gap-1">
              <Layers size={16} className="text-blue-400" /> {data.category}
            </span>
            <span className="flex items-center gap-1">
              <Earth size={16} className="text-blue-400" /> {data.country}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={16} className="text-blue-400" /> {data.location}
            </span>
            <span className="flex items-center gap-1">
              <UserRoundPen size={16} className="text-blue-400" /> {data.owner.name || "Unknown"}
            </span>
            {/* Follow Button */}
            {data.owner && user?._id !== data.owner._id && (
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className={`ml-4 px-3 py-1 text-xs rounded-full border transition ${isFollowing
                  ? "bg-transparent border-blue-500 text-blue-500 hover:bg-red-50 hover:text-red-500 hover:border-red-500"
                  : "bg-blue-500 border-blue-500 text-white hover:bg-blue-600"
                  }`}
              >
                {followLoading ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
          {/* 📝 Description */}
          <p className="mt-6 overflow-auto leading-relaxed max-w-3xl">{data.description}</p>

          {data?.owner && user?._id === data.owner._id ? (
            <div>
              <div className="flex gap-4">
                <NavLink to={`/listing/${listId}/Edit`} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Edit  Now
                </NavLink>
                <button onClick={() => setShowDeleteModal(true)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                  Delete Now
                </button>
              </div>
            </div>
          ) : null}

          <ConfirmModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() => {
              handleDelete(data._id);
              setShowDeleteModal(false);
            }}
            title="Delete Listing?"
            message="Are you sure you want to delete this listing? This action cannot be undone."
            isDark={isDark}
          />




        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 max-w-5xl mx-auto">
        {/* <ReviewForm listingId={listId} /> */}
        <Comment listingId={listId} />
      </div>
    </div>
  );
};

export default Listing;