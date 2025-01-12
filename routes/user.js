import express from "express";
import { getProfile,updateProfile } from "../controller/user.js";
import { userAuthentication } from './../middleware/authentication.js';

const router = express.Router(); 

// Define the route
router.get("/profile/v1",userAuthentication,getProfile);
router.get("/update/profile/v1",userAuthentication,updateProfile);

export default router;


