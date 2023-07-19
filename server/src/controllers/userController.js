const createError = require("http-errors");
const fs = require("fs").promises;
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const { deleteImage } = require("../helper/deleteImage");
const { createJsonWebToken } = require("../helper/jsonwebtoken");
const {
  jwtActivationKey,
  clientURL,
  jwtResetPasswordKey,
} = require("../secret");
const emailWithNodeMailer = require("../helper/email");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    //
    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };
    const options = { password: 0 };
    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();

    if (!users) throw createError(404, "no users found");

    return successResponse(res, {
      statusCode: 200,
      message: "users returned",
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;

    // console.log("UserInfo", req.userInfo);

    const options = { password: 0 };

    const user = await findWithId(User, id, options);
    return successResponse(res, {
      statusCode: 200,
      message: "user returned successfully ",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);
    const userImagePath = user.image;
    await deleteImage(userImagePath);
    await User.findByIdAndDelete({ _id: id, isAdmin: false });

    return successResponse(res, {
      statusCode: 200,
      message: "user were deleted successfully ",
    });
  } catch (error) {
    next(error);
  }
};

const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    console.log(req.body);

    const image = req.file;

    if (!image) {
      throw createError(400, "Image file is required");
    }
    // console.log({ image });

    if (image.size > 1024 * 1024 * 2) {
      throw createError(400, " File too large. It must be less than 2 MB");
    }

    // get image
    const imageBufferString = image.buffer.toString("base64");
    const userExists = await User.exists({ email: email });
    if (userExists) {
      throw createError(
        409,
        "User with this email already exist, Please sing in"
      );
    }

    // create jwt
    const token = createJsonWebToken(
      { name, email, password, phone, address, image: imageBufferString },
      jwtActivationKey,
      "10m"
    );

    // prepare email

    const emailData = {
      email,
      subject: "Account Activation Email",
      html: `
       <h2> Hello ${name} ! </h2>
       <p>Please click here to  <a href="${clientURL}/api/users/activate/${token}" target="_blank"> activate your account </a> </p>
      `,
    };
    // send email with nodemailer

    try {
      await emailWithNodeMailer(emailData);
    } catch (emailError) {
      next(createError(500, "Failed to send verification email"));
    }

    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} for completing your registration process`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};
const activateUserAccount = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) throw createError(404, "token not found");

    try {
      const decoded = jwt.verify(token, jwtActivationKey);
      if (!decoded) throw createError(401, " Unable to   verify user");

      const userExists = await User.exists({ email: decoded.email });
      if (userExists) {
        throw createError(
          409,
          "User with this email already exist, Please sing in"
        );
      }

      // console.log({ decoded });

      await User.create(decoded);
      return successResponse(res, {
        statusCode: 200,
        message: `user was registered successfully `,
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw createError(401, "Token  has expired");
      } else if (error.name === "JsonWebTokenError") {
        throw createError(401, "Invalid Token");
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

const updateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const options = { password: 0 };
    await findWithId(User, userId, options);

    const updateOptions = { new: true, runValidators: true, context: "query" };

    let updates = {};

    //
    /*
    if (req.body.name) {
      updates.name = req.body.name;
    }
    if (req.body.password) {
      updates.password = req.body.password;
    }
    if (req.body.phone) {
      updates.phone = req.body.phone;
    }
    if (req.body.address) {
      updates.address = req.body.address;
    }
    */

    //

    for (let key in req.body) {
      if (["name", "password", "phone", "address"].includes(key)) {
        updates[key] = req.body[key];
      } else if (["email"].includes(key)) {
        throw new Error("Email can not be updated");
      }
    }
    //
    const image = req.file;
    if (image) {
      if (image.size > 1024 * 1024 * 2) {
        throw createError(400, " File too large. It must be less than 2 MB");
      }
      updates.image = image.buffer.toString("base64");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(404, "User with this ID does not exist ");
    }
    //

    return successResponse(res, {
      statusCode: 200,
      message: "user were updated successfully ",
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};
const handleBanUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await findWithId(User, userId);

    const updates = { isBanned: true };

    const updateOptions = { new: true, runValidators: true, context: "query" };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(404, "User  was not banned successfully ");
    }
    //

    return successResponse(res, {
      statusCode: 200,
      message: "user  was banned successfully ",
    });
  } catch (error) {
    next(error);
  }
};
const handleUnbanUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await findWithId(User, userId);

    const updates = { isBanned: false };

    const updateOptions = { new: true, runValidators: true, context: "query" };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(404, "User  was not unbanned successfully ");
    }
    //

    return successResponse(res, {
      statusCode: 200,
      message: "user  was unbanned successfully ",
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdatePassword = async (req, res, next) => {
  try {
    const { email, oldPassword, newPassword, confirmedPassword } = req.body;
    const userId = req.params.id;
    const user = await findWithId(User, userId);

    //TODO: compare the password

    const isPasswordMatch = await bcryptjs.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      throw createError(401, "old password  did not correct");
    }

    // const filter = { userId };
    // const update = { $set: { password: newPassword } };
    // const updateOptions = { new: true };
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: newPassword },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      throw createError(400, "User  password   not updated successfully");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "user  password  updated successfully ",
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

const handleForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userData = await User.findOne({ email: email });
    if (!userData) {
      throw createError(
        404,
        "Email is incorrect or your have not verified your email address. Please register yourself first"
      );
    }

    // create jwt
    const token = createJsonWebToken({ email }, jwtResetPasswordKey, "15m");

    // prepare email

    const emailData = {
      email,
      subject: "Reset Password",
      html: `
       <h2> Hello ${userData.name} ! </h2>
       <p>Please click here to  <a href="${clientURL}/api/users/reset-password/${token}" target="_blank"> Reset your password </a> </p>
      `,
    };
    // send email with nodemailer

    try {
      await emailWithNodeMailer(emailData);
    } catch (emailError) {
      next(createError(500, "Failed to send reset password email"));
    }

    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} for resting  the password`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  processRegister,
  activateUserAccount,
  getUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  handleBanUserById,
  handleUnbanUserById,
  handleUpdatePassword,
  handleForgetPassword,
};
