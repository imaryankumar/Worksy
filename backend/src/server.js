import express from "express";
import CookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import Cors from "cors";
import { ENV } from "./config/env.js";
import connectDB from "./config/dbConnect.js";

// import routes
import userRoutes from "./routes/user.route.js";
import companyRoutes from "./routes/company.route.js";
import employeeRoutes from "./routes/employee.route.js";
import leaveRoutes from "./routes/leave.route.js";

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});

const allowedOrigins =
  process.env.NODE_ENV === "development"
    ? ["http://localhost:3000"]
    : ["https://worksy-xi.vercel.app"];

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(CookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(limiter);
app.use(
  Cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// routes
app.use("/api/v1/companies", companyRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/employee", employeeRoutes);
app.use("/api/v1/leave", leaveRoutes);

// Sample route
app.get("/", (req, res) => {
  res.send("Welcome to the Worksy Project Management API");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(err.message || "Internal Server Error");
});

// Start the server and connect to the database
app.listen(ENV.PORT, async () => {
  await connectDB();
  console.log(`server listening on http://localhost:${ENV.PORT}`);
});
