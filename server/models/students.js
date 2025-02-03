module.exports = (sequelize, DataTypes) => {
  const students = sequelize.define(
    'students',
    {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      session: {
        type: DataTypes.STRING,
      },
      year: {
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
      school: {
        type: DataTypes.STRING,
      },
      college: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      works: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      writings: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
    },
    {
      timestamps: true,
    }
  );

  return students;
};
