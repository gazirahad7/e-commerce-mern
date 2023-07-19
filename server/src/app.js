const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");
const { errorResponse } = require("./controllers/responseController");
const authRouter = require("./routers/authRouter");
const app = express();

const rateLimiter = rateLimit({
  windowMS: 1 * 60 * 1000,
  max: 10,
  message: "T00 many request from this API, please try again later",
});

app.use(cookieParser());
app.use(rateLimiter);
//app.use(xssClean());
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to server");
});

// users routers
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/seed", seedRouter);

// client error handling
app.use((req, res, next) => {
  next(createError(404, "Route not found !!!"));
});

// server error handling -> all the errors
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});

module.exports = app;
