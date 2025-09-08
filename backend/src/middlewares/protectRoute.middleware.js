import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const ProtectRoute = asyncHandler(async (req, res, next) => {
  const { userToken, companyToken } = req.cookies;
  if (!userToken || !companyToken) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided user and company.",
    });
  }
  try {
    const userDecoded = jwt.verify(userToken, process.env.JWT_SECRET);
    const companyDecoded = jwt.verify(companyToken, process.env.JWT_SECRET);
    req.user = userDecoded;
    req.company = companyDecoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid token" });
  }
});

export default ProtectRoute;
