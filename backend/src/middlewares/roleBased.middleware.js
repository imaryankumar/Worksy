const RoleBased = (roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: You don't have enough permission to access this resource",
      });
    }
    next();
  };
};

export default RoleBased;
