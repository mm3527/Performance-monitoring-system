module.exports = (sequelize, DataType) => {
    const appointment = sequelize.define("appointment", {
      pat_id: {
        type: DataType.STRING,
      },
      doc_id: {
        type: DataType.STRING,
      },
      app_date: {
        type: DataType.STRING,
      },
      app_time: {
        type: DataType.STRING,
      },
      specialist: {
        type: DataType.STRING,
      },
    });
    return appointment;
  };
  