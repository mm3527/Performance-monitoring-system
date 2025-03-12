module.exports = (sequelize, DataType) => {
  const inven = sequelize.define("inven", {
    med_id: {
      type: DataType.STRING,
    },
    med_name: {
      type: DataType.STRING,
    },
    med_qty: {
      type: DataType.STRING,
    },
    med_price: {
      type: DataType.STRING,
    },
  });
  return inven;
};
