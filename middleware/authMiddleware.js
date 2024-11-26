import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

// Protect route
export const protect = async (req, res, next) => {
  const token =
    req.headers.authorization.split(" ")[1] || req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized to access this route",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded._id).select("-password");

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `Not Authorized to access this route: ${error.message}`,
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Only ${allowedRoles.join(
          " or "
        )} can access this route.`,
      });
    }
    next();
  };
};
