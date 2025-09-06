import express from "express";
import { ENV } from "./config/env.js";
import connectDB from "./config/dbConnect.js";

// import routes
import userRoutes from "./routes/user.route.js";
import companyRoutes from "./routes/company.route.js";
import employeeRoutes from "./routes/employee.route.js";

const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1/companies", companyRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/employee", employeeRoutes);

// Sample route
app.get("/", (req, res) => {
  res.send("Welcome to the Worksy Project Management API");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send(err.message || "Internal Server Error");
});

// Start the server and connect to the database
app.listen(ENV.PORT, async () => {
  await connectDB();
  console.log(`server listening on http://localhost:${ENV.PORT}`);
});
