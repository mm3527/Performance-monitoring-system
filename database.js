const dbConfig = require("./config");

const Sequeliz = require("sequelize");
const Sequelize = new Sequeliz(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  dialectOptions: dbConfig.dialectOptions,
  operationsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.Sequelize = Sequelize;
db.pharstaff = require("./pharstaff")(Sequelize, Sequeliz.DataTypes);
db.inven = require("./inven")(Sequelize, Sequeliz.DataTypes);
db.patient = require("./patient")(Sequelize, Sequeliz.DataTypes);
db.appointment = require("./appointment")(Sequelize, Sequeliz.DataTypes);
db.doctor = require("./doctor")(Sequelize, Sequeliz.DataTypes);
db.bills = require("./bills")(Sequelize, Sequeliz.DataTypes);

db.Sequelize.sync({ force: false, alter: true }).then(() => {
  console.log("sync false ");
});
module.exports = db;
