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
const userRouter = express.Router();

// GET: api/users
userRouter.post(
  "/process-register",
  upload.single("image"),
  validateUserRegistration,
  runValidation,
  processRegister
);
userRouter.post("/verify", activateUserAccount);
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserById);
userRouter.put("/:id", upload.single("image"), updateUserById);
module.exports = userRouter;
