const express = require("express");
const {
  handleGetUsers,
  handleDeleteUserById,
  handleGetUserById,
  handleProcessRegister,
  handleActivateUserAccount,
  handleUpdateUserById,
  handleBanUserById,
  handleUnbanUserById,
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,
} = require("../controllers/userController");
const upload = require("../middleware/uploadFile");
const {
  validateUserRegistration,
  validateUserPasswordUpdate,
  validateUserForgetPassword,
  validateUserResetPassword,
} = require("../validators/auth");
const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middleware/auth");
const userRouter = express.Router();

// GET: api/users
userRouter.post(
  "/process-register",
  upload.single("image"),
  isLoggedOut,
  validateUserRegistration,
  runValidation,
  handleProcessRegister
);
userRouter.post("/activate", isLoggedOut, handleActivateUserAccount);
userRouter.get("/", isLoggedIn, isAdmin, handleGetUsers);
userRouter.get("/:id([0-9a-fA-F]{24})", isLoggedIn, handleGetUserById);
userRouter.delete("/:id", isLoggedIn, handleDeleteUserById);
userRouter.put(
  "/reset-password",
  validateUserResetPassword,
  runValidation,
  handleResetPassword
);
userRouter.put(
  "/:id([0-9a-fA-F]{24})",
  upload.single("image"),
  isLoggedIn,
  handleUpdateUserById
);
userRouter.put(
  "/ban-user/:id([0-9a-fA-F]{24})",
  isLoggedIn,
  isAdmin,
  handleBanUserById
);
userRouter.put(
  "/unban-user/:id([0-9a-fA-F]{24})",
  isLoggedIn,
  isAdmin,
  handleUnbanUserById
);
userRouter.put(
  "/update-password/:id([0-9a-fA-F]{24})",
  validateUserPasswordUpdate,
  runValidation,
  isLoggedIn,
  handleUpdatePassword
);
userRouter.post(
  "/forget-password",
  validateUserForgetPassword,
  runValidation,
  handleForgetPassword
);

module.exports = userRouter;
