import User from "../model/user.model.js";
import {
  hashPassword,
  comparePassword,
  genToken,
  setCookie,
} from "../lib/auth.js";
import { validateLogin, validateSignup } from "../validation/validateUser.js";

/**
 * @desc Register a user
 * @Route POST /api/auth/register
 * @Access Public
 */

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const { error } = validateSignup(req.body);
    if (error)
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw { status: 400, message: "user already exist" };
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
    next(error);
  }
};

/**
 * @desc Login a user
 * @Route POST /api/auth/login
 * @Access Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { error } = validateLogin(req.body);
    if (error)
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });

    const user = await User.findOne({ email });

    if (!user) {
      throw { status: 400, message: "Invalid email or password" };
    }

    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
      throw { status: 400, message: "Invalid credentials" };
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
    next(error);
  }
};

export { loginUser, registerUser };
