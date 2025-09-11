import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import ProtectRoute from "../middlewares/protectRoute.middleware.js";

const routes = express.Router();

routes.post("/register", ProtectRoute, registerUser);
routes.post("/login", loginUser);
routes.post("/logout", logoutUser);

export default routes;
