module.exports = (sequelize, DataTypes) => {
  const memorials = sequelize.define(
    'memorials',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      serial: {
        type: DataTypes.INTEGER,
      },
      batch: {
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: true,
    }
  );

  return memorials;
};
