module.exports = (sequelize, DataType) => {
  const patient = sequelize.define("patient", {
    name: {
      type: DataType.STRING,
    },
    email: {
      type: DataType.STRING,
    },
    mobile: {
      type: DataType.STRING,
    },
    address: {
      type: DataType.STRING,
    },
    password: {
      type: DataType.STRING,
    },
    gender: {
      type: DataType.STRING,
    },
    age: {
      type: DataType.STRING,
    }
  });
  return patient;
};
