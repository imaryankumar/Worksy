import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import EmployeeProfile from "../models/employee.model.js";
import { getCompanyToken, getUserToken } from "../utils/getToken.js";
import mongoose from "mongoose";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role, gender, designation } = req.body;
  if (!name || !email || !password || !role || !gender || !designation) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(req.company.id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid companyId format" });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email already in use",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Avatar
  const avatarUrl =
    gender === "male"
      ? `https://avatar.iran.liara.run/public/boy?username=${
          name.split(" ")[0]
        }`
      : `https://avatar.iran.liara.run/public/girl?username=${
          name.split(" ")[0]
        }`;

  const user = new User({
    companyId: req.company.id,
    name,
    email: email.toLowerCase(),
    phone,
    passwordHash: hashedPassword,
    role,
    profileImage: avatarUrl,
  });

  await user.save();

  const employeeCode = `EMP${String(user._id).slice(-4).toUpperCase()}`;
  const userToken = await getUserToken(user._id, res);

  const employeeProfile = new EmployeeProfile({
    userId: user._id,
    companyId: req.company.id,
    name,
    email: email.toLowerCase(),
    phone,
    employeeCode,
    gender,
    designation,
  });

  const employee = await employeeProfile.save();

  return res.status(201).json({
    success: true,
    userToken,
    message: "User registered successfully",
    user: user.toJSON(),
    employee: employee.toJSON(),
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (!existingUser) {
    return res.status(400).json({
      success: false,
      message: "User doesn't register",
    });
  }

  const comparePass = await bcrypt.compare(password, existingUser.passwordHash);
  if (!comparePass) {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password!",
    });
  }

  const userToken = await getUserToken(existingUser._id, res);
  const companyToken = await getCompanyToken(existingUser.companyId, res);

  return res.status(200).json({
    success: true,
    userToken,
    companyToken,
    user: {
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
      profilePic: existingUser.profileImage,
    },
    message: "User login successfully",
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  };
  res.clearCookie("userToken", cookieOptions);
  res.clearCookie("companyToken", cookieOptions);
  return res.status(200).json({
    success: true,
    message: "Logout successfully!",
    loggedOut: true,
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  const allusers = await User.find({});
  return res.status(200).json({
    success: true,
    allusers,
    totalCount: allusers.length,
    message: "Users fetched successfully",
  });
});
