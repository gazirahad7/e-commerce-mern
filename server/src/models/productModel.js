const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name  is required"],
      trim: true,
      unique: true,
      minLength: [3, "The length of product name can be minimum 3 characters"],
      maxLength: [
        150,
        "The length of product name can be maximum 150 characters",
      ],
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Product description  is required"],
      lowercase: true,
      trim: true,
      minLength: [
        5,
        "The length of product description  can be minimum 5 characters",
      ],
    },
    price: {
      type: Number,
      required: [true, "Product price  is required"],
      trim: true,
      validate: {
        validator: (v) => v > 0,
      },
      message: (props) =>
        `${props.value} is not a valid price ! Price must be greater then 0`,
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity   is required"],
      trim: true,
      validate: {
        validator: (v) => v > 0,
      },
      message: (props) =>
        `${props.value} is not a valid quantity ! quantity must be greater then 0`,
    },
    sold: {
      type: Number,
      default: 0,
    },
    shipping: {
      type: Number,
      default: 0, // shipping free 0 or paid something amount
    },
    image: {
      type: Buffer,
      contentType: String,
      required: [true, "Product Image  is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

const Product = model("Product", productSchema);

module.exports = Product;
