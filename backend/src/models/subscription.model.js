import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      unique: true,
    },

    plan: {
      type: String,
      enum: ["Free", "Starter", "Growth", "Pro"],
      default: "Free",
    },

    billingCycle: {
      type: String,
      enum: ["Monthly", "Quarterly", "SemiAnnual", "Annual", "TwoYear"],
      default: "Monthly",
    },

    employeeLimit: { type: Number, default: 50 },

    pricePerCycle: { type: Number, required: true, default: 0 },

    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },

    isActive: { type: Boolean, default: true },
    isAutoRenew: { type: Boolean, default: true },

    paymentHistory: [
      {
        gateway: {
          type: String,
          enum: ["Razorpay", "Stripe", "Cash"],
          default: "Razorpay",
        },
        amount: Number,
        currency: { type: String, default: "INR" },
        paidAt: { type: Date, default: Date.now },
        refId: String,
        status: {
          type: String,
          enum: ["Paid", "Failed", "Pending"],
          default: "Paid",
        },
      },
    ],

    // Track plan upgrades/downgrades
    changeLogs: [
      {
        oldPlan: String,
        newPlan: String,
        changedAt: { type: Date, default: Date.now },
        reason: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
