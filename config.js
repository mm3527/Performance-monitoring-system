module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "password",
  DB: "hospital",
  dialect: "mysql",
  //   dialectOptions: { ssl: true },
  pool: {
    max: 5,
    min: 0,
    acquire: 50000,
    idle: 5432,
  },
};
