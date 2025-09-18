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

  // Get start and end of the specific day
  const startOfDay = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
    0,
    0,
    0
  );
  const endOfDay = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
    23,
    59,
    59
  );

  // Find leaves that overlap with the specific date
  const leaves = await LeaveRequest.find({
    companyId: req.company.id._id,
    startDate: { $lte: endOfDay },
    endDate: { $gte: startOfDay },
  })
    .populate("userId", "name email profileImage")
    .populate("approvedByUserId", "name email")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    leaves,
    selectedDate: `${String(selectedDate.getDate()).padStart(2, "0")}-${String(
      selectedDate.getMonth() + 1
    ).padStart(2, "0")}-${selectedDate.getFullYear()}`,
    totalLeaves: leaves.length,
    message:
      leaves.length > 0
        ? `Found ${leaves.length} leave(s) on ${String(
            selectedDate.getDate()
          ).padStart(2, "0")}/${String(selectedDate.getMonth() + 1).padStart(
            2,
            "0"
          )}/${selectedDate.getFullYear()}`
        : `No leaves found on ${String(selectedDate.getDate()).padStart(
            2,
            "0"
          )}/${String(selectedDate.getMonth() + 1).padStart(
            2,
            "0"
          )}/${selectedDate.getFullYear()}`,
  });
});
