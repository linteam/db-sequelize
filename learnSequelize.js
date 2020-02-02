/*
psql mydb     //postgresql cli
select * from posts   //model adi post ise tablo adi posts olur.

*/

const Sequelize = require("sequelize");

function connect() {
  const db = {};

  let sequelize = new Sequelize(
    "devzahid",
    "postgres",
    "DozGz4136NowuyA33M3Y",
    {
      dialect: "postgres",
      host: "dbzahid.c5gsofzz46z5.eu-central-1.rds.amazonaws.com",
      port: "5432"
    }
  );
  //psql --host=dbzahid.c5gsofzz46z5.eu-central-1.rds.amazonaws.com--port=5432 --username=postgres --password=DozGz4136NowuyA33M3Y --dbname=devzahid

  console.log("sequelize initialized");

  //tablo tanimlama
  var Post = sequelize.define("post", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING
    },
    content: {
      type: Sequelize.TEXT
    },
    visible: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  });
  console.log("Post table defined");

  //Sync ile baglanip create ile tablo olusturulurken verilen data insert edildi.
  Post.sync().then(() => {
    var data = {
      title: "Hello Sequelize",
      content: "Fill this in later"
    };
    Post.create(data).then(post => {
      console.log(post.get());
    });
  });

  db.sequelize = sequelize;
  console.log("the end");
}

connect();
