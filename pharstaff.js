module.exports = (sequelize, DataType) => {
  const pharstaff = sequelize.define("pharstaff", {
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
    role: {
      type: DataType.STRING,
    },
  });
  return pharstaff;
};
