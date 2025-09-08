import mongoose from "mongoose";

const employeeProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    employeeCode: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["male", "female", "other"] },
    designation: { type: String, required: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    reportingToUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    joinDate: { type: Date, required: true, default: Date.now },
    employmentStatus: {
      type: String,
      enum: ["Active", "Inactive", "OnLeave"],
      default: "Active",
    },
    jobType: {
      type: String,
      enum: ["Remote", "On-Site", "Hybrid", "Contract", "Freelance"],
      default: "On-Site",
    },
    personal: {
      address: { type: String },
      phone: { type: String },
      dateOfBirth: { type: Date },
      maritalStatus: {
        type: String,
        enum: ["Single", "Married", "Divorced", "Widowed"],
      },
    },
    companyDetails: {
      probationMonths: { type: Number, default: 6 },
      contractType: {
        type: String,
        enum: ["Permanent", "Contractual"],
        default: "Permanent",
      },
    },
    leaveBalance: { type: Number, default: 24 },
  },
  { timestamps: true }
);

employeeProfileSchema.index(
  { companyId: 1, employeeCode: 1 },
  { unique: true }
);

const EmployeeProfile = mongoose.model(
  "EmployeeProfile",
  employeeProfileSchema
);
export default EmployeeProfile;
