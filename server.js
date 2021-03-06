const express = require("express");
const DBHandler = require("./src/0_db");
const CrudHandler = require("./src/1_crud");
const Asso = require("./src/2_association");
const app = express();
const port = 8001;

const db = new DBHandler();
console.log("Connect DB...");
db.connect();
const crud = new CrudHandler();
let asso = null;

app.listen(port, async () => {
  const uuid = await CrudHandler.buildUserTable();
  console.log("--- User table olusturuldu");
  asso = new Asso();
  await Asso.buildPostTable(uuid);
  console.log("--- Post table olusturuldu");

  console.log("Running server on port " + port);
});

//http://localhost:8001/mu?name=David&email=hakan@ibnhaldun.edu.tr&password=123
app.get("/mu", async (req, res) => {
  try {
    console.log();
    const user = req.query; //req.body.user; post olsa boyle al
    await crud.createUser(user);
    res.json(user);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.get("/findAll", async (req, res) => {
  try {
    const ret = await crud.findAll();
    res.json(ret);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.get("/findByPk", async (req, res) => {
  try {
    const ret = await crud.findByPk(req.query.id);
    res.json(ret);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.put("/update", async (req, res) => {
  try {
    const ret = await db.update(req.query.id);
    res.json(ret);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.delete("/remove", async (req, res) => {
  try {
    await crud.destroy(req.query.id);
    res.send("Item deleted");
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.get("/post", async (req, res) => {
  try {
    const posts = await asso.getPost_with_Comments_Authors();
    res.json(posts);
  } catch (error) {
    res.status(404).send(error.message);
  }
});
