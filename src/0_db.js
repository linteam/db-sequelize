const Sequelize = require("sequelize");

class DBHandler {
  constructor() {
    this.User = {};
  }

  static buildConnection() {
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
    DBHandler.connection = new Sequelize(
      db.name,
      db.username,
      db.password,
      db.options
    );
  }

  async connect() {
    try {
      DBHandler.buildConnection();
      await DBHandler.connection.authenticate();
      console.log("Database connection established successfully");
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DBHandler;
