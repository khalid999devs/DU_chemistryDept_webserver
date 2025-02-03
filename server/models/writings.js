module.exports = (sequelize, DataTypes) => {
  const writings = sequelize.define(
    'writings',
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
      details: {
        type: DataTypes.TEXT,
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

  return writings;
};
