import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import Company from "../models/company.model.js";
import User from "../models/user.model.js";
import EmployeeProfile from "../models/employee.model.js";
import { getCompanyToken, getUserToken } from "../utils/getToken.js";

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
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // Check company
  const existingCompany = await Company.findOne({
    $or: [
      { email: companyEmail.toLowerCase() },
      { gstNumber },
      { phone: companyPhone },
    ],
  });
  if (existingCompany) {
    return res.status(400).json({
      success: false,
      message: "Company email,phone or GST number already in use",
    });
  }

  // Check user
  const existingUser = await User.findOne({ email: ownerEmail.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User email already in use",
    });
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

  const userToken = await getUserToken(owner._id, res);
  const companyToken = await getCompanyToken(company._id, res);

  // Update company with ownerId
  company.ownerUserId = owner._id;
  await company.save();

  const employeeCode = `EMP${String(owner._id).slice(-4).toUpperCase()}`;

  // Create EmployeeProfile
  const employeeProfile = new EmployeeProfile({
    userId: owner._id,
    companyId: company._id,
    gender,
    employeeCode: employeeCode,
    designation: "Founder/Admin",
    companyDetails: { contractType: "Permanent" },
  });
  await employeeProfile.save();

  return res.status(201).json({
    success: true,
    message: "Company and owner created successfully",
    company,
    userToken,
    companyToken,
    owner: owner.toJSON(),
  });
});
