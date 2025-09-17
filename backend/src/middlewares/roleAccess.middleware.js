import User from "../models/user.model.js";

const RoleAccess = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userRole = req.user.id;
      if (!userRole) {
        return res.status(400).json({
          success: false,
          message: "User not found!!",
        });
      }
      const userRoles = await User.findById(userRole).select("role");
      if (allowedRoles.includes(userRoles.role)) {
        next();
      } else {
        return res.status(403).json({
          success: false,
          message:
            "Access denied. You do not have permission to perform this action.",
        });
      }
    } catch (error) {
      console.error(error?.message);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error!!",
      });
    }
  };
};

export default RoleAccess;
