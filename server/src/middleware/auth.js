const createError = require("http-errors");

const jwt = require("jsonwebtoken");
const { jwtAccessKey } = require("../secret");

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    console.log({ token });

    if (!token) {
      throw createError(401, "Access token not found. Please login");
    }

    const decoded = jwt.verify(token, jwtAccessKey);

    console.log({ decoded });

    if (!decoded) {
      throw createError(401, "Invalid access token, Please login again");
    }

    req.body.userId = decoded._id;
    next();
  } catch (error) {
    return next(error);
  }
};
const isLoggedOut = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (accessToken) {
      throw createError(400, "User is already loggedIn ");
    }
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { isLoggedIn, isLoggedOut };
