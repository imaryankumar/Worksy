import express from "express";
import {
  addWorkLog,
  getAllWorks,
  getWorkById,
  updateWorkLog,
  deleteWorkLog,
} from "../controllers/work.controller.js";
import ProtectRoute from "../middlewares/protectRoute.middleware.js";

const router = express.Router();

router.post("/add", ProtectRoute, addWorkLog);
router.get("/all-works", ProtectRoute, getAllWorks);
router.get("/:id", getWorkById);
router.put("/update/:id", updateWorkLog);
router.delete("/delete/:id", deleteWorkLog);

export default router;
