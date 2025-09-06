import express from "express";

const routes = express.Router();

// Sample user route
routes.get("/", (req, res) => {
  res.json({ message: "Employee route works!" });
});

export default routes;
