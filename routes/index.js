
import express from "express";
import vehicle from "./vehicle.js";
import auth from "./auth.js";
import user from "./user.js";

const router = express.Router();

router.use("/auth", auth);
router.use("/user", user);
router.use("/vehicle", vehicle);

export default router;
