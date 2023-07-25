const { body } = require("express-validator");
// registration validation

const validateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ min: 3 })
    .withMessage("Category should be at least 3  characters long"),
];

module.exports = {
  validateCategory,
};
