import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, passwordHash, role } = req.body;
  if (!name || !email || !passwordHash || !role) {
    res.status(400);
    throw new Error("Name, email, password, and role are required");
  }

  const existingUser = await User.find({ email: email.toLowerCase() });
  if (existingUser.length > 0) {
    res.status(400);
    throw new Error("Email already in use");
  }

  const user = new User({
    name,
    email: email.toLowerCase(),
    phone,
    passwordHash,
    role,
  });

  await user.save();
  res
    .status(201)
    .json({ message: "User registered successfully", user: user.toJSON() });
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
});
