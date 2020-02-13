const Sequelize = require("sequelize");
const DBHandler = require("./0_db");
const CrudHandler = require("./1_crud");

class Asso {
  constructor() {}

  static async buildPostTable(userId) {
    //POSTS Tablosu
    Asso.Post = DBHandler.connection.define(
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

    //puts foreignKey UserId in Post table
    Asso.Post.belongsTo(CrudHandler.User);
    /***
     * Foreign KEY iliski kuruldugunda otomatik `UserId` olarak olusturulur.
     * Ya da kolon ismini biz verebiliriz.
     * Post.belongsto(User, {foreignKey: 'userId'})
     ***/

    /***
     * Alias, iliski kurarken modele takma isim verilebilir
     * Include ederken ayni takma isim as ile verilir, veri cekildiginde bu takma isimle gelir.
     * Post.belongsto(User, {as: 'UserRef'})
     ***/

    await DBHandler.syncConnection();

    await Asso.Post.create({
      UserUuid: userId,
      title: "First Post",
      content: "post content 1"
    });
  }

  async findAll() {
    const posts = await Asso.Post.findAll({
      include: [CrudHandler.User]
      //include: [{model: CrudHandler.User, as: 'UserRef'}]
    });
    return posts;
  }
}

module.exports = Asso;
