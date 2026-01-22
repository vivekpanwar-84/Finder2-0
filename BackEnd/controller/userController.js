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
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
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



export { loginuser, registeruser };
