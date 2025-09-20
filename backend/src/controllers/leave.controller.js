import asyncHandler from "express-async-handler";
import { LeaveRequest, leaveTypes } from "../models/leave.model.js";
import { parseDate } from "../utils/parseDate.js";

export const AddLeaveRequest = asyncHandler(async (req, res) => {
  const { leaveType, startDate, endDate, reason } = req.body;

  if (!startDate || !endDate || !leaveType || !reason) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const isValidLeaveType = leaveTypes.includes(leaveType);

  if (!isValidLeaveType) {
    return res.status(400).json({
      success: false,
      message: "Invalid leave type!!",
      types: leaveTypes,
    });
  }

  const parsedStartDate = parseDate(startDate);
  const parsedEndDate = parseDate(endDate);

  if (parsedStartDate > parsedEndDate) {
    return res.status(400).json({
      success: false,
      message: "Start date cannot be after end date!",
    });
  }

  const overlappingLeaves = await LeaveRequest.findOne({
    userId: req.user.id,
    status: { $nin: ["Rejected"] },
    $or: [
      { startDate: { $lte: parsedEndDate, $gte: parsedStartDate } },
      { endDate: { $lte: parsedEndDate, $gte: parsedStartDate } },
      {
        startDate: { $lte: parsedStartDate },
        endDate: { $gte: parsedEndDate },
      },
    ],
  });

  if (overlappingLeaves) {
    return res.status(400).json({
      success: false,
      message: "You already have a leave request during this period!",
    });
  }

  const leave = await LeaveRequest.create({
    companyId: req.company.id._id,
    userId: req.user.id,
    type: leaveType,
    startDate: parsedStartDate,
    endDate: parsedEndDate,
    reason,
  });

  return res.status(201).json({
    success: true,
    message: "Leave request submitted successfully",
    leave,
  });
});

export const GetLeaveRequests = asyncHandler(async (req, res) => {
  const { date } = req.query;

  let selectedDate;

  if (!date) {
    selectedDate = new Date();
  } else {
    selectedDate = parseDate(date);

    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use DD-MM-YYYY format.",
      });
    }
  }

  // Get start and end of the specific day in UTC to avoid timezone issues
  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    // Find leaves that are active on the specific date
    // A leave is active on a date if: startDate <= selectedDate <= endDate
    const leaves = await LeaveRequest.find({
      companyId: req.company.id._id,
      $and: [
        { startDate: { $lte: endOfDay } },
        { endDate: { $gte: startOfDay } },
      ],
    })
      .populate("userId", "name email profileImage role status phone")
      .populate("approvedByUserId", "name email")
      .sort({ createdAt: -1 });

    // Optional: If you want to filter out duplicate employees (same employee, same date)
    // and only show unique employees per day, uncomment the following:
    /*
    const uniqueLeaves = [];
    const seenEmployees = new Set();
    
    for (const leave of leaves) {
      const employeeId = leave.userId._id.toString();
      if (!seenEmployees.has(employeeId)) {
        seenEmployees.add(employeeId);
        uniqueLeaves.push(leave);
      }
    }
    
    // Use uniqueLeaves instead of leaves in the response
    */

    const formattedDate = `${String(selectedDate.getDate()).padStart(
      2,
      "0"
    )}-${String(selectedDate.getMonth() + 1).padStart(
      2,
      "0"
    )}-${selectedDate.getFullYear()}`;

    return res.status(200).json({
      success: true,
      allLeaves: {
        employees: leaves,
      },
      selectedDate: formattedDate,
      totalLeaves: leaves.length,
      message:
        leaves.length > 0
          ? `Found ${leaves.length} leave(s) on ${formattedDate}`
          : `No leaves found on ${formattedDate}`,
    });
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching leave requests",
      error: error.message,
    });
  }
});
