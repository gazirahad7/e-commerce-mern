const createError = require("http-errors");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");

const Category = require("../models/categoryModel");
const {
  createCategory,
  getCategories,
  getCategory,
} = require("../services/categoryService");

const handleCreateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    await createCategory(name);

    return successResponse(res, {
      statusCode: 200,
      message: "category was created  successfully ",
    });
  } catch (error) {
    next(error);
  }
};
const handleGetCategories = async (req, res, next) => {
  try {
    const categories = await getCategories();

    return successResponse(res, {
      statusCode: 200,
      message: "categories fetched    successfully ",
      payload: categories,
    });
  } catch (error) {
    next(error);
  }
};
const handleGetCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const categories = await getCategory(slug);

    return successResponse(res, {
      statusCode: 200,
      message: "category fetched    successfully ",
      payload: categories,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  handleCreateCategory,
  handleGetCategories,
  handleGetCategory,
};
