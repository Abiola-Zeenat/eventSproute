import User from "../model/user.model.js";

/**
 * @desc Get all users
 * @Route GET /api/users
 * @Access Private, admin only
 */

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      message: "All Users Retrieved successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Update a user role
 * @Route  PUT /api/users/:id/role
 * @Access Private -admin only
 */

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ message: `The user with id of ${id} was not found` });
    }
    if (role) {
      user.role = role;
      await user.save();
      res.status(201).json({
        success: true,
        message: "User Updated Successfully",
        data: user,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getUsers, updateUserRole };
