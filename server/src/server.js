const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(morgan("dev"));

app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to server");
});
app.get("/test", (req, res) => {
  res.status(200).send("success test HTTP request");
});

//

app.listen(3001, () => {
  console.log(`server in running at http://localhost:3001`);
});
