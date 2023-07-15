require("dotenv").config();
const serverPort = process.env.SERVER_PORT || 4000;

module.exports = { serverPort };
