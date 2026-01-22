import Review from "../model/reviewModel.js";
import Listing from "../model/listingModel.js";

// Add a review to a listing
export const addReview = async (req, res) => {
    try {
        const { listingId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user; // from auth middleware

        if (!rating || !comment) {
            return res.status(400).json({ success: false, message: "Rating and comment are required" });
        }

        const listing = await  Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing not found" });
        }

        const review = new Review({
            author: userId,
            rating,
            comment,
            listing: listing._id,
        });

        await review.save();

        listing.reviews.push(review._id);
        await listing.save();

        res.status(201).json({ success: true, review });
    } catch (error) {
        console.error("Add Review Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all reviews for a listing
export const getReviews = async (req, res) => {
  try {
    const { listingId } = req.params;
    if (!listingId) return res.status(400).json({ success: false, message: "Listing ID missing" });

    const reviews = await Review.find({ listing: listingId }).populate("author", "name");
    
    res.json({ success: true, reviews });
  } catch (error) {
    console.error("Get Reviews Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Delete a review (only by the author)
export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        if (review.author.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        await Review.findByIdAndDelete(reviewId);

        // Remove review from listing
        await Listing.findByIdAndUpdate(review.listing, {
            $pull: { reviews: review._id },
        });

        res.status(200).json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
        console.error("Delete Review Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
