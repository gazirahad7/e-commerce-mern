const app = require("./app");
const { serverPort } = require("./secret");

app.listen(serverPort, () => {
  console.log(`server in running at http://localhost:${serverPort}`);
});
