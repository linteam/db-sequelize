const express = require("express");
const DBHandler = require("./src/lseq");
const app = express();
const port = 8001;

const db = new DBHandler();

app.listen(port, () => {
  db.connect();
  console.log("Running server on port " + port);
});

//http://localhost:8001/mu?name=David&email=hakan@ibnhaldun.edu.tr&password=123
app.get("/mu", async (req, res) => {
  try {
    console.log();
    const user = req.query; //req.body.user; post olsa boyle al
    await db.createUser(user);
    res.json(user);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.get("/findAll", async (req, res) => {
  try {
    const ret = await db.findAll();
    res.json(ret);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.get("/findById", async (req, res) => {
  try {
    const ret = await db.findById(req.query.id);
    res.json(ret);
  } catch (error) {
    res.status(404).send(error.message);
  }
});
