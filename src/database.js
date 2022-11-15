const mongoose = require('mongoose');
const config = require('./config/config');
const logger = require('./config/logger');
const { Sequelize } = require('sequelize');

const dbHeroSnake = mongoose.createConnection(
  config.heroSnake.url,
  config.heroSnake.options,
  (err) => {
    if (err) {
      logger.error(`Connect DB ${config.heroSnake.url} error`);
      process.exit(1);
    } else {
      logger.info(`Connect DB ${config.heroSnake.url} successfully`);
    }
  },
  5000
);

const sequelize = new Sequelize('ofa', 'root', '', {
  host: 'localhost',
  dialect: 'mysql' /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
});

module.exports = {
  dbHeroSnake,
  sequelize,
};
