const express = require("express");
const routerApi = require("./routes");
const server = express();
const port = 4000;

server.use(express.json());

routerApi(server);

server.use("/", (req, res) => {
  res.send("API test");
});

server.listen(port, () => {
  console.log("mi port" + port);
});
