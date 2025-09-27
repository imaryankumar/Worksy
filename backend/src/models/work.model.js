import mongoose from "mongoose";

const workLogSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      index: true,
      default: null,
    },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    date: { type: Date, required: true },
    hours: { type: Number, required: true, min: 0 },
    notes: { type: String },
    day: { type: String, required: true, enum: ["full_day", "half_day"] },
  },
  { timestamps: true }
);

workLogSchema.index({ companyId: 1, userId: 1, projectId: 1, date: 1 });

const WorkLog = mongoose.model("WorkLog", workLogSchema);
export default WorkLog;
