require("dotenv").config();
const serverPort = process.env.SERVER_PORT || 4000;
const mongodbUrl =
  process.env.MONGODB_URL || "mongodb://localhost:27017/ecommerceMernDB";
const defaultImagePath =
  process.env.DEFAULT_USER_IMAGE_PATH || "public/images/users/default.jpeg";
module.exports = {
  serverPort,
  mongodbUrl,
  defaultImagePath,
};
