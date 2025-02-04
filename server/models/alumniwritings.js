module.exports = (sequelize, DataTypes) => {
  const alumniwritings = sequelize.define(
    'alumniwritings',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subtitle: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      writerInfo: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      images: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
    },
    {
      timestamps: true,
    }
  );

  return alumniwritings;
};
