import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

// Protect route
export const protect = async (req, res, next) => {
  let { accessToken } = req.cookies;

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized to access this route",
    });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id).select("-password");

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `Not Authorized to access this route: ${error.message}`,
    });
  }
};

export const admin = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "only Admin can access this route",
    });
  }
};
