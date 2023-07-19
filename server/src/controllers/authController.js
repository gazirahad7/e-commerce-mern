const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const { successResponse } = require("./responseController");
const { createJsonWebToken } = require("../helper/jsonwebtoken");
const { jwtAccessKey, jwtRefreshKey } = require("../secret");

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

    const userInfo = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
    };
    const userWithoutPassword = await User.findOne({ email }).select(
      "-password"
    );

    // access token

    const accessToken = createJsonWebToken({ userInfo }, jwtAccessKey, "15m");
    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      // secure: true,
      sameSite: "none",
    });

    // refresh token
    const refreshToken = createJsonWebToken({ userInfo }, jwtRefreshKey, "7d");
    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      // secure: true,
      sameSite: "none",
    });

    //TODO: success response

    return successResponse(res, {
      statusCode: 200,
      message: "User logged in successfully  ",
      payload: { userWithoutPassword },
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
const handleRefreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    const decodedToken = jwt.verify(oldRefreshToken, jwtRefreshKey);

    if (!decodedToken) {
      throw createError(400, "Invalid refresh token, Please login again");
    }

    // create token
    const accessToken = createJsonWebToken(
      decodedToken.userInfo,
      jwtAccessKey,
      "15m"
    );
    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      // secure: true,
      sameSite: "none",
    });
    return successResponse(res, {
      statusCode: 200,
      message: "New access token is generated  ",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};
const handleProtectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const decodedToken = jwt.verify(accessToken, jwtAccessKey);
    if (!decodedToken) {
      throw createError(401, "Invalid access token, Please login again");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "Protected resources accessed successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleProtectedRoute,
};
