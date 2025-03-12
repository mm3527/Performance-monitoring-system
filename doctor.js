module.exports = (sequelize, DataType) => {
  const doctor = sequelize.define("doctor", {
    name: {
      type: DataType.STRING,
    },
    mobile: {
      type: DataType.STRING,
    },
    password: {
      type: DataType.STRING,
    },
    age: {
      type: DataType.STRING,
    },
    gender: {
      type: DataType.STRING,
    },
    specialization: {
      type: DataType.STRING,
    },
  });
  return doctor;
};
