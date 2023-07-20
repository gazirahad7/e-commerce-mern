const mongoose = require("mongoose");
const { mongodbUrl } = require("../secret");
const logger = require("../controllers/loggerController");

const connectDB = async (options = {}) => {
  try {
    await mongoose.connect(mongodbUrl, options);
    // console.log("Connection to DB is successfully established");

    logger.log("info", "Connection to DB is successfully established");

    mongoose.connection.on("error", (error) => {
      logger.log("error", "DB connection error:", error);
    });
  } catch (error) {
    logger.log("error", "Could not connection to DB", error.toString());
  }
};

module.exports = connectDB;
