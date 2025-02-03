module.exports = (sequelize, DataTypes) => {
  const events = sequelize.define(
    'events',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.STRING,
      },
      year: {
        type: DataTypes.STRING,
      },
      details: {
        type: DataTypes.TEXT,
      },
      banner: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      gallery: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      segments: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
    },
    {
      timestamps: true,
    }
  );

  return events;
};
