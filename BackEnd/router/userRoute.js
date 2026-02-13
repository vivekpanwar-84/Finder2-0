import express from "express";
import { loginuser, registeruser, getProfile } from "../controller/userController.js";
import userAuth from "../middleware/userAuth.js";

const userRouter = express.Router();

userRouter.post("/register", registeruser);
userRouter.post("/login", loginuser);
userRouter.get("/profile", userAuth, getProfile);
// userRouter.post('/adminlogin', adminlogin);

export default userRouter;