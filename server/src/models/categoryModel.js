const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category  is required"],
      trim: true,
      unique: true,
      minLength: [3, "The length of user name can be minimum 31 characters"],
    },
    slug: {
      type: String,
      required: [true, "Category slug is required"],
      lowercase: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Category = model("Category", categorySchema);

module.exports = Category;
