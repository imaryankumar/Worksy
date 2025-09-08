import express from "express";
import { registerUser } from "../controllers/user.controller.js";
import RoleBased from "../middlewares/rolebased.middleware.js";
import ProtectRoute from "../middlewares/protectRoute.middleware.js";

const routes = express.Router();

routes.post("/register", ProtectRoute, registerUser);

export default routes;
