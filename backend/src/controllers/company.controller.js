import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import Company from "../models/company.model.js";
import User from "../models/user.model.js";
import EmployeeProfile from "../models/employee.model.js";

export const createCompany = asyncHandler(async (req, res) => {
  const {
    companyName,
    companyEmail,
    companyPhone,
    gstNumber,
    ownerName,
    ownerEmail,
    ownerPhone,
    address,
    password,
    role, // should always be "Admin"
    gender,
  } = req.body;

  if (
    !companyName ||
    !companyEmail ||
    !address ||
    !ownerEmail ||
    !ownerName ||
    !password ||
    !role ||
    !gstNumber ||
    !ownerPhone ||
    !companyPhone ||
    !gender
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  // Check company
  const existingCompany = await Company.findOne({
    $or: [{ email: companyEmail.toLowerCase() }, { gstNumber }],
  });
  if (existingCompany) {
    res.status(400);
    throw new Error("Company email or GST number already in use");
  }

  // Check user
  const existingUser = await User.findOne({ email: ownerEmail.toLowerCase() });
  if (existingUser) {
    res.status(400);
    throw new Error("User email already in use");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create company first
  const company = new Company({
    name: companyName,
    email: companyEmail.toLowerCase(),
    phone: companyPhone,
    address,
    gstNumber,
  });
  await company.save();

  // Avatar
  const avatarUrl =
    gender === "male"
      ? `https://avatar.iran.liara.run/public/boy?username=${
          ownerName.split(" ")[0]
        }`
      : `https://avatar.iran.liara.run/public/girl?username=${
          ownerName.split(" ")[0]
        }`;

  // Create owner user
  const owner = new User({
    companyId: company._id,
    name: ownerName,
    email: ownerEmail.toLowerCase(),
    phone: ownerPhone,
    passwordHash: hashedPassword,
    role: "Admin",
    profileImage: avatarUrl,
  });
  await owner.save();

  // Update company with ownerId
  company.ownerUserId = owner._id;
  await company.save();

  // Create EmployeeProfile
  const employeeProfile = new EmployeeProfile({
    userId: owner._id,
    companyId: company._id,
    gender,
    employeeCode: "EMP001",
    designation: "Founder/Admin",
    companyDetails: { contractType: "Permanent" },
  });
  await employeeProfile.save();

  res.status(201).json({
    message: "Company and owner created successfully",
    company,
    owner: owner.toJSON(),
  });
});
