const express = require("express");
const {
  getUsers,
  deleteUserById,
  getUserById,
  processRegister,
  activateUserAccount,
  updateUserById,
} = require("../controllers/userController");
const upload = require("../middleware/uploadFile");
const { validateUserRegistration } = require("../validators/auth");
const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut } = require("../middleware/auth");
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
userRouter.get("/", isLoggedIn, getUsers);
userRouter.get("/:id", isLoggedIn, getUserById);
userRouter.delete("/:id", isLoggedIn, deleteUserById);
userRouter.put("/:id", upload.single("image"), isLoggedIn, updateUserById);
module.exports = userRouter;
