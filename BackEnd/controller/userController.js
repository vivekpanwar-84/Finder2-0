import dotenv from 'dotenv';
dotenv.config();
import userModel from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
    console.log(id);
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// const createToken = (id) => {
//     if (!process.env.JWT_SECRET) {
//         throw new Error("JWT_SECRET is missing in environment variables");
//     }

//     // Create token with user id and expiry
//     return jwt.sign(
//         { id },               // payload (must include 'id')
//         process.env.JWT_SECRET, // secret key
//         { expiresIn: "7d" }     // optional: token expires in 7 days
//     );
// };

//***************login user
const loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;
        //check for user existence
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email } });
        } else {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}

//***************register user
const registeruser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(req.body);

        //check for user existence
        const exist = await userModel.findOne({ email });

        if (exist) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        //validate email or password
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }
        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // save user to database

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        // console.log("data was saved in db", user);

        const token = createToken(user._id);
        res.json({ success: true, token });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}



//***************get user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId)
            .select('-password')
            .populate('followers', 'name email')
            .populate('following', 'name email');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

//***************follow user
const followUser = async (req, res) => {
    try {
        const userId = req.user.id; // Current user
        const { id } = req.params; // User to follow

        if (userId === id) {
            return res.status(400).json({ success: false, message: "You cannot follow yourself" });
        }

        const userToFollow = await userModel.findById(id);
        const currentUser = await userModel.findById(userId);

        if (!userToFollow || !currentUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (currentUser.following.some(u => u.toString() === id)) {
            return res.status(400).json({ success: false, message: "You are already following this user" });
        }

        await userModel.findByIdAndUpdate(id, { $addToSet: { followers: userId } });
        await userModel.findByIdAndUpdate(userId, { $addToSet: { following: id } });

        res.json({ success: true, message: "User followed successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

//***************unfollow user
const unfollowUser = async (req, res) => {
    try {
        const userId = req.user.id; // Current user
        const { id } = req.params; // User to unfollow

        if (userId === id) {
            return res.status(400).json({ success: false, message: "You cannot unfollow yourself" });
        }

        const userToUnfollow = await userModel.findById(id);
        const currentUser = await userModel.findById(userId);

        if (!userToUnfollow || !currentUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!currentUser.following.some(u => u.toString() === id)) {
            return res.status(400).json({ success: false, message: "You are not following this user" });
        }

        await userModel.findByIdAndUpdate(id, { $pull: { followers: userId } });
        await userModel.findByIdAndUpdate(userId, { $pull: { following: id } });

        res.json({ success: true, message: "User unfollowed successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

//***************get user by id
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id).select("name email");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export { loginuser, registeruser, getProfile, followUser, unfollowUser, getUserById };
