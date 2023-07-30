const { body } = require("express-validator");
// registration validation

const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Product should be at least 3 to 150 characters long"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 5 })
    .withMessage("Description should be at least 3 to 150 characters long"),
  body("price")
    .trim()
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("category").trim().notEmpty().withMessage("Category is required"),

  body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive number"),
];

module.exports = {
  validateProduct,
};
