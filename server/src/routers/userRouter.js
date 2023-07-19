const express = require("express");
const {
  getUsers,
  deleteUserById,
  getUserById,
  processRegister,
  activateUserAccount,
  updateUserById,
  handleBanUserById,
  handleUnbanUserById,
  handleUpdatePassword,
} = require("../controllers/userController");
const upload = require("../middleware/uploadFile");
const {
  validateUserRegistration,
  validateUserPasswordUpdate,
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
  processRegister
);
userRouter.post("/activate", isLoggedOut, activateUserAccount);
userRouter.get("/", isLoggedIn, isAdmin, getUsers);
userRouter.get("/:id", isLoggedIn, getUserById);
userRouter.delete("/:id", isLoggedIn, deleteUserById);
userRouter.put("/:id", upload.single("image"), isLoggedIn, updateUserById);
userRouter.put("/ban-user/:id", isLoggedIn, isAdmin, handleBanUserById);
userRouter.put("/unban-user/:id", isLoggedIn, isAdmin, handleUnbanUserById);
userRouter.put(
  "/update-password/:id",
  validateUserPasswordUpdate,
  runValidation,
  isLoggedIn,
  handleUpdatePassword
);
module.exports = userRouter;
