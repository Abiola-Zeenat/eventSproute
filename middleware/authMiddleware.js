import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

// Protect route
export const protect = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

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

export const organizer = async (req, res, next) => {
  if (req.user && req.user.role === "organizer") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "only Organizer can access this route",
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
