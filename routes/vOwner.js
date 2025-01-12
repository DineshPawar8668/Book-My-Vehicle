import express from "express";
import { getProfile, updateProfile } from "../controller/vOwner.js";
import {
  vOwnerAuthentication,
} from "./../middleware/authentication.js";

const router = express.Router();

// Define the route
router.get("/profile/v1", vOwnerAuthentication, getProfile);
router.get("/update/profile/v1", vOwnerAuthentication, updateProfile);

export default router;
