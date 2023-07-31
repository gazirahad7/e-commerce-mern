const createError = require("http-errors");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const slugify = require("slugify");

const Product = require("../models/productModel");
const { createProduct, getProducts } = require("../services/productService");

const handleCreateProduct = async (req, res, next) => {
  const { name, description, price, quantity, shipping, category } = req.body;

  try {
    const image = req.file;

    if (!image) {
      throw createError(400, "Image file is required");
    }
    if (image.size > 1024 * 1024 * 2) {
      throw createError(400, " File too large. It must be less than 2 MB");
    }

    // get image
    const imageBufferString = image.buffer.toString("base64");

    const productData = {
      name,
      description,
      price,
      quantity,
      shipping,
      category,
      imageBufferString,
    };

    const product = await createProduct(productData);
    return successResponse(res, {
      statusCode: 200,
      message: "Product was created  successfully ",
      payload: product,
    });
  } catch (error) {
    next(error);
  }
};
const handleGetProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;

    const productsData = await getProducts(page, limit);

    return successResponse(res, {
      statusCode: 200,
      message: " returned all  the  products ",
      payload: {
        products: productsData?.products,

        pagination: {
          totalPages: productsData?.totalPages,
          currentPage: productsData?.currentPage,
          previousPage: page - 1,
          nextPage: page + 1,
          totalNumberOfProducts: productsData?.count,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateProduct,
  handleGetProducts,
};
