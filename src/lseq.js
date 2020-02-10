const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const Op = Sequelize.Op;
class DBHandler {
  constructor() {
    console.log("CONSTRUCTOR");
    this.User = {};
  }

  async connect() {
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
    this.User = connection.define(
      "User",
      {
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
        password: {
          type: Sequelize.STRING,
          validate: {
            isAlphanumeric: true
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
      },
      {
        hooks: {
          afterValidate: user => {
            //beforeCreate
            if (user.password)
              user.password = bcrypt.hashSync(user.password, 8);
          }
        }
      }
    );

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
        force: false,
        logging: console.log
      });
      const created = await this.User.create({
        name: "Zahid",
        email: "a@ibnhaldun.edu.tr",
        password: "123"
      });
      await connection.authenticate();
      console.log("Database connection established successfully");
      return created;
    } catch (error) {
      throw error;
    }
  }

  async createUser(user) {
    const created = await this.User.create({
      name: user.name,
      email: user.email,
      password: user.password
    });
    return created;
  }

  async findAll() {
    const retVal = await this.User.findAll({
      where: {
        //name: "David"
        name: {
          [Op.like]: "Dav%" //Dav ile baslayan isimleri getir
        }
        // [Op.and] {a:5}
        //gt:50, lte: 45, in: [1,2,3]
      }
    });
    return retVal;
  }
}

module.exports = DBHandler;
