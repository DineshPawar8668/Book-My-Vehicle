import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { ErrorHandler } from "../middleware/errorHandler.js";

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // Check if user exists
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Send user data to client
    res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: user,
    });
  } catch (error) {
    return handleError(error, res, next);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // Check if user exists
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Update user data
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true, // Ensure all validations are applied
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return handleError(error, res, next);
  }
};
