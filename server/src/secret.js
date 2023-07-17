require("dotenv").config();
const serverPort = process.env.SERVER_PORT || 4000;
const mongodbUrl =
  process.env.MONGODB_URL || "mongodb://localhost:27017/ecommerceMernDB";
const defaultImagePath =
  process.env.DEFAULT_USER_IMAGE_PATH || "public/images/users/default.jpeg";

const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "cat";
const smtpUserName = process.env.SMTP_USERNAME || "";
const smtpPassword = process.env.SMTP_PASSWORD || "";
const clientURL = process.env.CLIENT_URL || "";

const uploadDir = process.env.UPLOAD_FILE || "public/images/users";
module.exports = {
  serverPort,
  mongodbUrl,
  defaultImagePath,
  jwtActivationKey,
  smtpUserName,
  smtpPassword,
  clientURL,
  uploadDir,
};
