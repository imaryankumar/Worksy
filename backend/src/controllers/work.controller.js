import asyncHandler from "express-async-handler";
import WorkLog from "../models/work.model.js";
import { parseDate } from "../utils/parseDate.js";

export const addWorkLog = asyncHandler(async (req, res) => {
  const { date, hours, notes, day } = req.body;
  if (!date || !hours || !day) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  const parsedDate = parseDate(date);
  if (new Date(parsedDate) > new Date()) {
    return res.status(400).json({
      success: false,
      message: "you cannot add work log for future dates",
    });
  }
  const addedWorkLog = await WorkLog.findOne({
    userId: req.user.id,
    date: parsedDate,
  });
  if (addedWorkLog) {
    return res.status(400).json({
      success: false,
      message: "Work log for this date already exists",
    });
  }
  const workLog = await WorkLog.create({
    companyId: req.company.id._id,
    userId: req.user.id,
    date: parsedDate,
    hours,
    notes,
    day,
  });

  if (!workLog) {
    return res.status(400).json({
      success: false,
      message: "Invalid work log data",
    });
  }

  return res.status(201).json({
    success: true,
    message: "Work log added successfully",
    data: workLog,
  });
});

export const getAllWorks = asyncHandler(async (req, res) => {
  const works = await WorkLog.find({
    $or: [{ userId: req.user.id }, { companyId: req.company.id_id }],
  }).sort({ date: -1 });
  return res.status(200).json({
    success: true,
    count: works.length,
    data: works,
  });
});

export const getWorkById = asyncHandler(async (req, res) => {
  res.send("Get work by ID route is working");
});

export const updateWorkLog = asyncHandler(async (req, res) => {
  res.send("Update work log route is working");
});

export const deleteWorkLog = asyncHandler(async (req, res) => {
  res.send("Delete work log route is working");
});
