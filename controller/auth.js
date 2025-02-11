import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { ErrorHandler } from "../middleware/errorHandler.js";
import jwt from "jsonwebtoken";
import { handleError } from "../helper/handleError.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1min",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export const registerUser = async (req, res, next) => {
  const { name, mobileNo, password, email, role, location } = req.body;

  console.log(req.body);

  if (!name || !mobileNo || !password || !email || !role) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  try {
    const existingUser = await User.findOne({ email , role});
    if (existingUser) {
      return next(new ErrorHandler(`Your account already exists as a ${existingUser?.role}`, 409));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      mobileNo,
      password: hashedPassword,
      email,
      role,
      location,
    });

    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {

    console.log(error)
    return handleError(error, res, next);
  }
};

export const login = async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Email password and role are required", 400));
  }

  try {
    const user = await User.findOne({ email, role });
    if (!user) {
      return next(new ErrorHandler("Invalid credentials", 401));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid credentials", 401));
    }

    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return handleError(error, res, next);
  }
};

export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new ErrorHandler("Refresh token is required", 400));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorHandler("Invalid refresh token", 401));
    }

    const newAccessToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    return handleError(error, res, next);
  }
};
