const Sequelize = require("sequelize");
const DBHandler = require("./0_db");
const bcrypt = require("bcrypt");
const Op = Sequelize.Op;
class CrudHandler {
  constructor() {}
  static async buildUserTable() {
    //USER Tablosunu olusturma
    CrudHandler.User = DBHandler.connection.define(
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

    await DBHandler.syncConnection(true);

    const created = await CrudHandler.User.create({
      name: "Zahid",
      email: "a@ibnhaldun.edu.tr",
      password: "123"
    });

    return created.uuid;
  }

  async createUser(user) {
    const created = await CrudHandler.User.create({
      name: user.name,
      email: user.email,
      password: user.password
    });
    return created;
  }

  async findAll() {
    const retVal = await CrudHandler.User.findAll({
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

  async findByPk(id) {
    const retVal = await CrudHandler.User.findByPk(id);
    return retVal;
  }

  async update(id) {
    //update sonucu etkilenen satır sayısını doner
    const rows = await CrudHandler.User.update(
      { name: "Hakan", password: "Celik" },
      {
        where: { uuid: id }
      }
    );
    return rows;
  }

  async destroy(id) {
    await CrudHandler.User.destroy({
      where: { uuid: id }
    });
  }
}

module.exports = CrudHandler;
