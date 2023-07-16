const createError = require("http-errors");
const User = require("../models/userModel");
const { default: mongoose } = require("mongoose");

const findUser = async (id) => {
  try {
    const options = { password: 0 };
    const user = await User.findById(id, options);

    if (!user) {
      throw createError(404, "user does not exist with this id");
    }

    return user;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createError(400, "Invalid user id");
    }

    throw error;
  }
};

module.exports = { findUser };
