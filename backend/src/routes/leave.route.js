import express from "express";
import {
  AddLeaveRequest,
  GetLeaveRequests,
} from "../controllers/leave.controller.js";
import ProtectRoute from "../middlewares/protectRoute.middleware.js";

const routes = express.Router();

routes.post("/add", ProtectRoute, AddLeaveRequest);
routes.get("/", ProtectRoute, GetLeaveRequests);

export default routes;
