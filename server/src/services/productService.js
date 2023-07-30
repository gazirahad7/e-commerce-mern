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
const getCategories = async () => {
  return await Product.find({}).select("name slug").lean();
};
const getProduct = async (slug) => {
  return await Product.find({ slug }).select("name slug").lean();
};
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
  getCategories,
  getProduct,
  updateProduct,
  deleteProduct,
};
