const express = require("express");
const db = require("./src/lseq");
const app = express();
const port = 8001;

app.listen(port, () => {
  console.log("Running server on port " + port);
});

app.get("/", async (req, res) => {
  try {
    const user = await db.connect();
    res.json(user);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.post("/user", (req,res) => {
  try {
    const user = req.body.user;
    await db.createUser(user);
    res.json(user);
  } catch (error) {
    res.status(404).send(error.message);
  }
});
