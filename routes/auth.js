import express from "express";
import { login, refreshToken, registerUser } from "../controller/auth.js";
const router = express.Router(); 

// Define the route
router.post("/register/v1", registerUser);
router.post("/login/v1", login);
router.post("/refresh/v1", refreshToken);

export default router;



