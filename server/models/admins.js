module.exports = (sequelize, DataTypes) => {
  const admins = sequelize.define('admins', {
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return admins;
};
