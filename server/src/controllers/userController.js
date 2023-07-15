const createError = require("http-errors");
const users = require("../models/userModel");
const getUsers = (req, res, next) => {
  try {
    res.status(200).send({
      message: "users returned ",
      users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers };
