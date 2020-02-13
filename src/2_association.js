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

    Asso.Comment = DBHandler.connection.define("Comment", {
      the_comment: Sequelize.STRING
    });

    /***
     * Iliski Tipleri
      * One to One
        belongsTo() or hasOne()
        hasone belongsTo'nun tersi Post.hasOne(User) dedigimizde
        posts tablosuna userID eklenir.
     
      * One to Many
        User.hasMany(Post) demek 1 User bir cok Post'a sahip olabilir demek.
        Bunun icin post tablosuna userId ekleniyor. User'a ait Postlar cekilebiliyor.
        Boylece.

      * Many to Many
        belongsToMany() bunu kullanirken iki tabloya da uyguluyoruz.
          User.belongsToMany(Post)
          Post.belongsToMany(User)
        bu her tablonun PK'larindan olusan 2 kolonluk bir Join table olusturur.
        Boylece sorgu yapilinca iliskiden array doner.


     ***/

    //puts foreignKey UserId in Post table
    Asso.Post.belongsTo(CrudHandler.User, {
      as: "Author"
    });

    Asso.Post.hasMany(Asso.Comment, {
      as: "All_Comments" //foreignKey = PostId in Comment Table
    });
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

    await DBHandler.syncConnection(false);
    console.log("Post ekliyorum");
    const p1 = await Asso.Post.create({
      AuthorUuid: userId,
      title: "First Post",
      content: "post content 1"
    });
    Asso.samplePostId = p1.uuid;
    console.log("2 adet yorum ekliyorum");
    await Asso.Comment.create({
      PostUuid: Asso.samplePostId,
      the_comment: "yorumda mi yapmayalim"
    });
    await Asso.Comment.create({
      PostUuid: Asso.samplePostId,
      the_comment: "second yorumda mi yapmayalim 2"
    });
  }

  async getAuthors() {
    const authors = await CrudHandler.User.findAll({
      include: [Asso.Post],
      as: "All_Posts"
      //include: [{model: CrudHandler.User, as: 'UserRef'}]
    });
    return authors;
  }

  async getComment() {
    // const comments = await Asso.Post.findAll({
    //   include: [
    //     {
    //       model: Asso.Comment,
    //       as: "All_Comments",
    //       attributes: ["the_comment"]
    //     }
    //   ]
    // });
    const comments = await Asso.Post.findByPk(Asso.samplePostId, {
      include: [
        {
          model: Asso.Comment,
          as: "All_Comments",
          attributes: ["the_comment"]
        },
        {
          model: CrudHandler.User,
          as: "Author"
        }
      ]
    });
    return comments;
  }
}

module.exports = Asso;
