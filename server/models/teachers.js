module.exports = (sequelize, DataTypes) => {
  const teachers = sequelize.define(
    'teachers',
    {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING,
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
        type: DataTypes.STRING,
      },
      researchf: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      works: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
    },
    {
      timestamps: true,
    }
  );

  return teachers;
};
