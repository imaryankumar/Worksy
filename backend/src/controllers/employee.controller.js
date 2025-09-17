import asyncHandler from "express-async-handler";
import EmployeeProfile from "../models/employee.model.js";

export const getEmployees = asyncHandler(async (req, res) => {
  const companyId = req.company.id;
  const getAllEmployees = await EmployeeProfile.find({ companyId })
    .populate({
      path: "userId",
      select: "-password -__v -createdAt -updatedAt",
    })
    .populate({
      path: "companyId",
      select: "-__v -createdAt -updatedAt -isVerified",
    });
  return res.status(200).json({
    success: true,
    getAllEmployees,
    totalCount: getAllEmployees.length,
    message: "Employees fetched successfully",
  });
});
