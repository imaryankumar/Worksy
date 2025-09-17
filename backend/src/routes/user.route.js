import express from "express";
import {
  getUsers,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import ProtectRoute from "../middlewares/protectRoute.middleware.js";
import RoleAccess from "../middlewares/roleAccess.middleware.js";

const routes = express.Router();

routes.post("/register", ProtectRoute, registerUser);
routes.post("/login", loginUser);
routes.post("/logout", logoutUser);
routes.get("/all", ProtectRoute, RoleAccess(["SuperAdmin"]), getUsers);

export default routes;
