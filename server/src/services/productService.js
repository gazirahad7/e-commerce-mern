const createError = require("http-errors");
const slugify = require("slugify");

const Product = require("../models/productModel");

const createProduct = async (productData) => {
  const {
    name,
    description,
    price,
    quantity,
    shipping,
    category,
    imageBufferString,
  } = productData;

  const productExists = await Product.exists({ name: name });
  if (productExists) {
    throw createError(409, "Product  with this name already exist");
  }

  const newProduct = await Product.create({
    name: name,
    slug: slugify(name),
    description: description,
    price: price,
    quantity: quantity,
    shipping: shipping,
    image: imageBufferString,
    category: category,
  });
  return newProduct;
};
const getProducts = async (page = 1, limit = 4) => {
  const products = await Product.find({})
    .populate("category")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  if (!products) {
    throw createError(404, "no products found");
  }

  const count = await Product.find({}).countDocuments();

  return {
    products,
    count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  };
};
const getProduct = async () => {};
const updateProduct = async (name, slug) => {
  const filter = { slug };
  const updates = { $set: { name: name, slug: slugify(name) } };
  const option = { new: true };
  const updateProduct = await Product.findOneAndUpdate(filter, updates, option);
  return updateProduct;
};

const deleteProduct = async (slug) => {
  const result = await Product.findOneAndDelete({ slug });

  return result;
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
