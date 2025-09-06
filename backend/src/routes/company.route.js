import express from "express";
import { createCompany } from "../controllers/company.controller.js";

const routes = express.Router();

// Sample user route
routes.post("/register", createCompany);

export default routes;
