const express = require("express");

const upload = require("../middleware/uploadFile");

const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middleware/auth");
const { handleCreateProduct } = require("../controllers/productController");
const { validateProduct } = require("../validators/product");
const productRouter = express.Router();

// GET: api/users
productRouter.post(
  "/",
  upload.single("image"),

  validateProduct,
  runValidation,
  isLoggedIn,
  isAdmin,

  handleCreateProduct
);

module.exports = productRouter;
