const createError = require("http-errors");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");

const Category = require("../models/categoryModel");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
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
      statusCode: 201,
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
    const category = await getCategory(slug);

    if (!category) {
      throw createError(404, "Category not found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "category fetched    successfully ",
      payload: category,
    });
  } catch (error) {
    next(error);
  }
};
const handleUpdateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { slug } = req.params;
    const updatedCategory = await updateCategory(name, slug);

    if (!updatedCategory) {
      throw createError(404, "No Category  found with this slug");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "category  updated    successfully ",
      payload: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};
const handleDeleteCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const result = await deleteCategory(slug);

    if (!result) {
      throw createError(404, "No Category  found ");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "category  deleted    successfully ",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  handleCreateCategory,
  handleGetCategories,
  handleGetCategory,
  handleUpdateCategory,
  handleDeleteCategory,
};
