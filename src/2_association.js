const Sequelize = require("sequelize");
const DBHandler = require("./0_db");
const CrudHandler = require("./src/1_crud");
const Op = Sequelize.Op;

class Asso {
  constructor() {
    this.Post = {};
    this.crud = new CrudHandler();
  }

  async buildPostTable() {
    //POSTS Tablosu
    const Post = DBHandler.connection.define(
      "Post",
      {
        uuid: {
          type: Sequelize.UUID, //ilk once type belirtilmeli
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
          /*ATTRIBUTES:
          unique, allowNull, validate*/
        },
        title: Sequelize.STRING,
        content: Sequelize.TEXT
      },
      {
        timestamps: false
      }
    );
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

module.exports = Asso;
