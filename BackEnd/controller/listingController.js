import { v2 as cloudinary } from 'cloudinary';
import { json } from 'express';
import listingModel from '../model/listingModel.js';


const addListing = async (req, res) => {



    try {
        const { title, description, author, country, category, location } = req.body;

        // const image1 = req.files.image1 && req.files.image1[0];
        // const image2 = req.files.image2 && req.files.image2[0];
        // const image3 = req.files.image3 && req.files.image3[0];
        // const image4 = req.files.image4 && req.files.image4[0];


        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];

        // console.log(req.files);

        const image = [image1, image2, image3, image4].filter((item) => item !== undefined);

        // if (!name || !price || !description || !category || !subCategory || !size) {
        //     return res.status(400).json({ success: false, message: "All fields are required......." });
        // }

        let imageurls = await Promise.all(
            image.map(async (img) => {
                const result = await cloudinary.uploader.upload(img.path,);
                // console.log("img url", result.secure_url);
                return result.secure_url;
            })
        );


        // 👤 Add logged-in user as owner (from userAuth middleware)
        const userId = req.user?.id; // from JWT
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: No user ID found" });
        }
        // console.log(name, price, description, category, subCategory, size, bestseller,);
        // // Create a new product instance
        const newListing = new listingModel({
            title,
            description,
            country,
            category,
            location,
            image: imageurls,
            date: new Date(),
            owner: userId,
        });

        // // Save the product to the database
        const listing = await newListing.save();
        res.status(201).json({ success: true, message: "listing added successfully" });
        console.log("listing added successfully");

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}

















const list = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        const { search, category, country } = req.query;

        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } }
            ];
        }

        if (category) {
            query.category = category;
        }

        if (country) {
            query.country = country;
        }

        const totalListings = await listingModel.countDocuments(query);
        const totalPages = Math.ceil(totalListings / limit);

        const listings = await listingModel.find(query)
            .skip(skip)
            .limit(limit)
            .populate({
                path: "reviews",
                populate: { path: "author" }
            })
            .populate("owner");

        res.json({
            success: true,
            listings,
            pagination: {
                totalListings,
                totalPages,
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const deleteListing = async (req, res) => {
    try {
        console.log("Deleting listing with ID:", req.params.deleteId);
        await listingModel.findByIdAndDelete(req.params.deleteId);

        res.status(200).json({ success: true, message: "Listing deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });

    }

}

const singleListing = async (req, res) => {
    try {
        const listing = await listingModel.findById(req.params.id);
        console.log("Fetching listing with ID:", req.params.id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        res.json(listing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const editListing = async (req, res) => {
    try {
        const { editId } = req.params;
        const userId = req.user.id;
        console.log(userId);

        console.log("Editing listing with ID:", editId);

        const { title, description, country, category, location } = req.body;

        // 🧾 Find existing listing
        const listing = await listingModel.findById(editId);
        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing not found" });
        }

        // 🧑‍💼 Check user authorization (optional)
        if (req.user && listing.owner && req.user.id.toString() !== listing.owner.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized user" });
        }


        // 🖼 Handle new image uploads
        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];
        const newImages = [image1, image2, image3, image4].filter(Boolean);

        let imageUrls = listing.image; // keep old images by default

        if (newImages.length > 0) {
            imageUrls = await Promise.all(
                newImages.map(async (img) => {
                    const result = await cloudinary.uploader.upload(img.path);
                    return result.secure_url;
                })
            );
        }

        // 🛠 Update fields
        listing.title = title || listing.title;
        listing.description = description || listing.description;
        listing.country = country || listing.country;
        listing.category = category || listing.category;
        listing.location = location || listing.location;
        listing.image = imageUrls;
        listing.date = new Date();

        await listing.save();

        res.status(200).json({
            success: true,
            message: "Listing updated successfully",
            listing,
        });
    } catch (error) {
        console.error("Error updating listing:", error);
        res.status(500).json({
            success: false,
            message: "Server error while updating listing",
        });
    }
};

const userListings = async (req, res) => {
    try {
        const userId = req.user.id;
        const listings = await listingModel.find({ owner: userId });
        res.status(200).json({ success: true, listings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export default editListing;



export { addListing, list, deleteListing, singleListing, editListing, userListings };