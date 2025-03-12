module.exports = (sequelize, DataType) => {
  const bills = sequelize.define("bills", {
    pat_id: {
      type: DataType.STRING,
    },
    med_id: {
      type: DataType.STRING,
    },
    med_name: {
      type: DataType.STRING,
    },
    medi_qty: {
      type: DataType.STRING,
    },
    timing: {
      type: DataType.STRING,
    },
  });
  return bills;
};
