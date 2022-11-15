const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'conversation',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      data: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      thang: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      thag: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'conversation',
      timestamps: false,
    }
  );
};
