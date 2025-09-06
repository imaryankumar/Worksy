import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    gstNumber: { type: String, required: true, unique: true },
    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);
export default Company;
