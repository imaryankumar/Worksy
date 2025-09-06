import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["Admin", "HR", "Manager", "Employee"],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
      index: true,
    },
    profileImage: { type: String },
    lastLoginAt: { type: Date },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.index({ companyId: 1, email: 1 }, { unique: true });

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

userSchema.pre("save", async function (next) {
  if (this.role === "SuperAdmin") {
    const existingSuperAdmin = await mongoose.models.User.findOne({
      role: "SuperAdmin",
    });
    if (existingSuperAdmin && this.isNew) {
      return next(
        new Error("SuperAdmin already exists. You cannot create another one.")
      );
    }
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
