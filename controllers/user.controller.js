import User from "../model/user.model.js";
import { validateUpdateRole } from "../validation/validateUser.js";

/**
 * @desc Get all users
 * @Route GET /api/users
 * @Access Private, admin only
 */

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      message: "All Users Retrieved successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update a user role
 * @Route  PUT /api/users/:id/role
 * @Access Private -admin only
 */

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const { error } = validateUpdateRole({ role });
    if (error) throw { status: 400, message: error.details[0].message };
   
    const user = await User.findById(id).select("-password");

    if (!user) {
      throw { status: 404, message: `The user with id of ${id} was not found` };
    }

    user.role = role;
    const updatedUser = await user.save();
    res.status(201).json({
      success: true,
      message: "User Updated Successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export { getUsers, updateUserRole };
