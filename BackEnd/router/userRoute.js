import express from "express";
import { loginuser, registeruser, getProfile, followUser, unfollowUser, getUserById } from "../controller/userController.js";
import userAuth from "../middleware/userAuth.js";

const userRouter = express.Router();

userRouter.post("/register", registeruser);
userRouter.post("/login", loginuser);
userRouter.get("/profile", userAuth, getProfile);
// userRouter.post('/adminlogin', adminlogin);
userRouter.post("/follow/:id", userAuth, followUser);
userRouter.post("/unfollow/:id", userAuth, unfollowUser);
userRouter.get("/:id", userAuth, getUserById);

export default userRouter;