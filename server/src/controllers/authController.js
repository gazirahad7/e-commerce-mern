const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const { successResponse } = require("./responseController");
const { createJsonWebToken } = require("../helper/jsonwebtoken");
const { jwtAccessKey } = require("../secret");

const handleLogin = async (req, res, next) => {
  try {
    //TODO: email , password

    const { email, password } = req.body;
    //TODO: isExist

    const user = await User.findOne({ email });

    if (!user) {
      throw createError(
        404,
        "User does not exist with this email. Please register first"
      );
    }
    //TODO: compare the password

    const isPasswordMatch = await bcryptjs.compare(password, user.password);

    if (!isPasswordMatch) {
      throw createError(401, "Password did not match");
    }

    //TODO: isBanned
    if (user.isBanned) {
      throw createError(403, "You are banned. Please contact authority");
    }
    //TODO: token , cookie

    const accessToken = createJsonWebToken(
      { _id: user._id },
      jwtAccessKey,
      "10m"
    );

    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      // secure: true,
      sameSite: "none",
    });

    //TODO: success response

    return successResponse(res, {
      statusCode: 200,
      message: "User logged in successfully  ",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};
const handleLogout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");

    //TODO: success response

    return successResponse(res, {
      statusCode: 200,
      message: "User logged out successfully  ",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleLogin, handleLogout };
