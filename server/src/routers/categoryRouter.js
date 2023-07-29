const express = require("express");

const upload = require("../middleware/uploadFile");

const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middleware/auth");
const {
  handleCreateCategory,
  handleGetCategories,
  handleGetCategory,
  handleUpdateCategory,
  handleDeleteCategory,
} = require("../controllers/categoryController");
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
categoryRouter.get("/", handleGetCategories);
categoryRouter.get("/:slug", handleGetCategory);
categoryRouter.put(
  "/:slug",
  validateCategory,
  runValidation,
  isLoggedIn,
  isAdmin,
  handleUpdateCategory
);
categoryRouter.delete(
  "/:slug",
  validateCategory,
  runValidation,
  isLoggedIn,
  isAdmin,
  handleDeleteCategory
);

module.exports = categoryRouter;
