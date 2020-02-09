const Sequelize = require("sequelize");

async function connect() {
  const db = {
    name: "devzahid",
    username: "postgres",
    password: "changeme",
    options: {
      dialect: "postgres",
      host: "localhost",
      port: "5432"
    }
    // , Global tanimlama yerine modele 3. parametre verilebilir.
    // define: {
    //   freezeTableName: false
    // }
  };
  const connection = new Sequelize(
    db.name,
    db.username,
    db.password,
    db.options
  );

  //USER Tablosunu olusturma
  const User = connection.define("User", {
    uuid: {
      type: Sequelize.UUID, //Universal Unique Identifier
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    name: Sequelize.STRING,
    bio: Sequelize.JSON
  });

  //POSTS Tablosu
  const Post = connection.define(
    "Post",
    {
      uuid: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      name: Sequelize.STRING
    },
    {
      timestamps: false
    }
  );

  try {
    await connection.sync({
      force: true,
      logging: console.log
    });
    await User.create({
      name: "Zahid",
      bio: { settings: "deneme" }
    });
    await connection.authenticate();
    console.log("Database connection established successfully");
  } catch (error) {
    console.log("Baglanti Hatasi: ", error.message);
  }
}

module.exports = connect;
