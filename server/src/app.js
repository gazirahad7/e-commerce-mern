const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");

const app = express();

const rateLimiter = rateLimit({
  windowMS: 1 * 60 * 1000,
  max: 5,
  message: "T00 many request from this API, please try again later",
});

app.use(rateLimiter);
app.use(xssClean());
app.use(cors());
app.use(morgan("dev"));

// express built-in middleware for working json data as req body
//app.use(express.json());
// express built-in middleware for working from data
///app.use(express.urlencoded({ extended: true }));

// third party middleware alt for upper to middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const isLoggedIn = (req, res, next) => {
//   console.log("isLoggedIn middleware");
//   next();
// };

app.get("/", (req, res) => {
  res.send("Welcome to server");
});
app.get("/api/user", (req, res) => {
  res.status(200).send("User return");
});

// client error handling
app.use((req, res, next) => {
  // res.status(404).json({ message: "Route not found" });

  //   createError(404, "Route not found !!!");
  //   next();

  next(createError(404, "Route not found !!!"));
});

// server error handling -> all the errors
app.use((err, req, res, next) => {
  return res
    .status(err.status || 500)
    .json({ success: false, message: err.message });
});

module.exports = app;
