import express from "express";
import { registerUser, loginUser } from "../Controller/usercontroller.js"

const userroute = express.Router();

userroute.post("/register", registerUser);
userroute.post("/login", loginUser);

export default userroute;