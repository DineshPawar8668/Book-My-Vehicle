import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { ErrorHandler } from "../middleware/errorHandler.js";

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    // Send tokens to client
    res.status(200).json({
      success: true,
      message: "Get user  data successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler("Server error", 500));
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });
    // Send tokens to client
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler("Server error", 500));
  }
};
