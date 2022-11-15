const initModel = require('./init-models');
const { sequelize } = require('../src/database');

module.exports = {
  models: initModel(sequelize),
};
