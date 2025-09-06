import mongoose from "mongoose";
import { ENV } from "./env.js";

const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(ENV.MONGO_URI);
    console.log("MongoDB connected successfully", connection.host);
  } catch (err) {
    console.error(err.message || "Error connecting to the database");
    process.exit(1);
  }
};

export default connectDB;
