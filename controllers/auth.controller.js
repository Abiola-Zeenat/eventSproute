import User from "../model/user.model.js";
import {
  hashPassword,
  comparePassword,
  genToken,
  setCookie,
} from "../lib/auth.js";

/**
 * @desc Register a user
 * @Route POST /api/auth/register
 * @Access Public
 */

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "user already exist",
      });
    }
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user",
    });

    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Login a user
 * @Route POST /api/auth/login
 * @Access Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: `Invalid email or password` });
    }

    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = genToken({
      _id: user._id,
      email: user.email,
      role: user.role,
    });
    const expiry = 1000 * 60 * 60 * 24; // 24hr
    setCookie(res, "accessToken", accessToken, expiry);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: accessToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { loginUser, registerUser };
