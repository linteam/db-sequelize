const express = require("express");
const connect = require("./src/lseq");
const app = express();
const port = 8001;

app.listen(port, () => {
  console.log("Running server on port " + port);
});

app.get("/", async (req, res) => {
  try {
    const user = await connect();
    res.json(user);
  } catch (error) {
    res.status(404).send(error.message);
  }
});
