const express = require("express");
const connect = require("./src/lseq");
const app = express();
const port = 8001;

app.listen(port, () => {
  console.log("Running server on port " + port);
});

connect();
