import asyncHandler from "express-async-handler";
import EmployeeProfile from "../models/employee.model.js";
import User from "../models/user.model.js";

export const getEmployees = asyncHandler(async (req, res) => {
  const companyId = req.company.id;
  const { search = "", offset = 0, limit = 10 } = req.query;

  let query = { companyId };

  // Search logic
  if (search) {
    const userIds = await User.find({
      companyId,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }).distinct("_id");

    query = {
      companyId,
      $or: [
        { userId: { $in: userIds } },
        { employeeCode: { $regex: search, $options: "i" } },
        { designation: { $regex: search, $options: "i" } },
      ],
    };
  }

  // Get paginated employees
  const employees = await EmployeeProfile.find(query)
    .populate("userId", "-password -__v -createdAt -updatedAt")
    .populate("companyId", "-__v -createdAt -updatedAt -isVerified")
    .skip(Number(offset))
    .limit(Number(limit));

  // Get total count for ALL company employees (not search results)
  const allEmployees = await EmployeeProfile.find({ companyId });
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const counts = allEmployees.reduce(
    (acc, emp) => {
      acc.total++;
      if (emp.gender === "male") acc.male++;
      if (emp.gender === "female") acc.female++;
      if (new Date(emp.createdAt) >= sevenDaysAgo) acc.latest++;
      return acc;
    },
    { total: 0, male: 0, female: 0, latest: 0 }
  );

  return res.status(200).json({
    success: true,
    employees,
    totalCount: counts,
    pagination: {
      offset: Number(offset),
      limit: Number(limit),
      total: counts.total,
      hasMore: counts.total > Number(offset) + Number(limit),
    },
    message: "Employees fetched successfully",
  });
});
