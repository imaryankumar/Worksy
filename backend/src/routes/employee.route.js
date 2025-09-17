import express from "express";
import ProtectRoute from "../middlewares/protectRoute.middleware.js";
import { getEmployees } from "../controllers/employee.controller.js";

const routes = express.Router();

// Sample user route
routes.get("/", ProtectRoute, getEmployees);

export default routes;
