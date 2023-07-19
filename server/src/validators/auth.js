const { body } = require("express-validator");
// registration validation

const validateUserRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required. Enter your full name")
    .isLength({ min: 3, max: 31 })
    .withMessage("Name should be at least 3-31  characters long"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required. Enter your email address")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required. Enter your password ")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required. Enter your address")
    .isLength({ min: 3 })
    .withMessage("Password should be at least 3 characters long"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required. Enter your phone number"),
  body("image")
    .custom((value, { req }) => {
      if (!req.file || !req.file.buffer) {
        throw new Error("User image is required");
      }
      return true;
    })
    .withMessage("User image is required"),
];

const validateUserLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required. Enter your email address")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required. Enter your password ")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
];
const validateUserPasswordUpdate = [
  body("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("Old Password is required. Enter your old password ")
    .isLength({ min: 6 })
    .withMessage("Old Password should be at least 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "Old Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New Password is required. Enter your new password ")
    .isLength({ min: 6 })
    .withMessage("new Password should be at least 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "new Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
  body("confirmedPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Password did not match");
    }
    return true;
  }),
];

const validateUserForgetPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required. Enter your email address")
    .isEmail()
    .withMessage("Invalid email address"),
];
const validateUserResetPassword = [
  body("token").trim().notEmpty().withMessage("Token  is missing"),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New Password is required. Enter your new password ")
    .isLength({ min: 6 })
    .withMessage("new Password should be at least 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "new Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
];
const validateUserRefreshToken = [
  body("token").trim().notEmpty().withMessage("Refresh token  is missing"),
];
// sign in validation

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateUserPasswordUpdate,
  validateUserPasswordUpdate,
  validateUserForgetPassword,
  validateUserResetPassword,
  validateUserRefreshToken,
};
