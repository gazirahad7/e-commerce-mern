const express = require("express");

const upload = require("../middleware/uploadFile");

const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middleware/auth");
const { handleCreateCategory } = require("../controllers/categoryController");
const { validateCategory } = require("../validators/category");
const categoryRouter = express.Router();

categoryRouter.post(
  "/",
  validateCategory,
  runValidation,
  isLoggedIn,
  isAdmin,
  handleCreateCategory
);
categoryRouter.get("/:id([0-9a-fA-F]{24})", isLoggedIn);
categoryRouter.delete("/:id", isLoggedIn);

module.exports = categoryRouter;
