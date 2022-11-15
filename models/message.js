const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'message',
    {
      name: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      test: {
        type: DataTypes.STRING(4),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'message',
      timestamps: false,
    }
  );
};
