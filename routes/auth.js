import express from "express";
import { login, registerUser } from "../controller/auth.js";
const router = express.Router(); 

// Define the route
router.post("/register/v1", registerUser);
router.post("/login/v1", login);

export default router;



