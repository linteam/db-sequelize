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
    name: {
      type: Sequelize.STRING,
      validate: {
        len: [3]
      }
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        //isCreditCard: true
        isEmail: {
          msg: "Lutfen gecerli bir email giriniz"
        },
        contains: {
          args: ["ibnhaldun.edu.tr"],
          msg: "Error: Field must contain ibnhaldun.edu.tr"
        }
      }
    },
    bio: Sequelize.JSON
  });

  //POSTS Tablosu
  const Post = connection.define(
    "Post",
    {
      uuid: {
        type: Sequelize.UUID, //ilk once type belirtilmeli
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
        /*ATTRIBUTES:
        unique, allowNull, validate*/
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
    const created = await User.create({
      name: "Zahid",
      email: "a@ibnhaldun.edu.tr",
      //creditCard: "2342342343434323",
      bio: { settings: "deneme" }
    });
    await connection.authenticate();
    console.log("Database connection established successfully");
    return created;
  } catch (error) {
    throw error;
  }
}

module.exports = connect;
