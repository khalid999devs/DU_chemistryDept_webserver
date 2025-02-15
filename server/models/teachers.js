module.exports = (sequelize, DataTypes) => {
  const teachers = sequelize.define(
    'teachers',
    {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      designation: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      researchf: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      works: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
    },
    {
      timestamps: true,
    }
  );

  return teachers;
};
