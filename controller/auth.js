import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { ErrorHandler } from "../middleware/errorHandler.js";
import jwt from "jsonwebtoken";
import pkg from "jsonwebtoken";
const { JsonWebTokenError } = pkg;

export const registerUser = async (req, res,next) => {
  const { name, mobileNo, password, email, role,location } = req.body;

  // Check if all fields are provided
  if (!name || !mobileNo || !password || !email || !role) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    // Create a new user with the hashed password
    const newUser = new User({
      name,
      mobileNo,
      password: hashedPassword,
      email,
      role,
      location
    });

    // Save the user to the database
    await newUser.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.log(error)
    next(new ErrorHandler("Server error", 500));
  }
};

// Generate JWT Access Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "300y",
  }); // Access token expires in 1 hour
};

// Generate JWT Refresh Token
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "360d",
  }); // Refresh token expires in 7 days
};

// Login API
export const login = async (req, res, next) => {
  const { email, password, role } = req.body;

  // Check if email and password are provided
  if (!email || !password || !role) {
    return next(new ErrorHandler("Email and password are required", 400));
  }

  try {
    // Find user by email
    const user = await User.findOne({ email, role });
    if (!user) {
      return next(new ErrorHandler("Invalid credentials", 401));
    }

    // Compare the provided password with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid credentials", 401));
    }

    // Generate access token and refresh token
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Send tokens to client
    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler("Server error", 500));
  }
};

// Refresh Token API
export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new ErrorHandler("Refresh token is required", 400));
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorHandler("Invalid refresh token", 401));
    }

    // Generate new access token
    const newAccessToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired refresh token", 401));
  }
};
