require("dotenv").config();
const serverPort = process.env.SERVER_PORT || 4000;
const mongodbUrl =
  process.env.MONGODB_URL || "mongodb://localhost:27017/ecommerceMernDB";
module.exports = { serverPort, mongodbUrl };
