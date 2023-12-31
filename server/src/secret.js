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
const jwtAccessKey = process.env.JWT_ACCESS_KEY || "DOG";
const jwtResetPasswordKey = process.env.JWT_RESET_PASSWORD || "EGG";
const jwtRefreshKey = process.env.JWT_REFRESH_KEY || "KEY";

module.exports = {
  serverPort,
  mongodbUrl,
  defaultImagePath,
  jwtActivationKey,
  smtpUserName,
  smtpPassword,
  clientURL,
  jwtAccessKey,
  jwtResetPasswordKey,
  jwtRefreshKey,
};
