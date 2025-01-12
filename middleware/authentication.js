import User from "../models/user.js";
import { ErrorHandler } from "./errorHandler.js";
import jwt from "jsonwebtoken";

export const userAuthentication = async (req, res, next) => {
  // Get the Access Token from the Authorization header
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from 'Bearer token'

  // If no token is provided, return Unauthorized error
  if (!token) {
    return res.status(401).json({ message: "Access token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.id };

    const user = await User.findById(req.user._id);
    if (user?.role !== "User") {
      return res.status(400).send({
        message: "You are not authorize user",
      });
    }

    // console.log( decoded)
    return next();
  } catch (error) {
    console.error("Authentication failed:", error);
    next(new ErrorHandler("Invalid or expired Access Token", 401));
  }
};


export const vOwnerAuthentication = async (req, res, next) => {
  // Get the Access Token from the Authorization header
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from 'Bearer token'

  // If no token is provided, return Unauthorized error
  if (!token) {
    return res.status(401).json({ message: "Access token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.id };

    const user = await User.findById(req.user._id);
    if (user?.role !== "VOwner") {
      return res.status(400).send({
        message: "You are not authorize user",
      });
    }

    // console.log( decoded)
    return next();
  } catch (error) {
    console.error("Authentication failed:", error);
    next(new ErrorHandler("Invalid or expired Access Token", 401));
  }
};
