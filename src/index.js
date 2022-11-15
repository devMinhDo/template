const mongoose = require('mongoose');
const { models } = require('../models/index');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

let server;
const { dbHeroSnake, sequelize } = require('./database');

if (!dbHeroSnake) {
  logger.error(`Connect DB ${config.heroSnake.url} fail`);
}
if (dbHeroSnake) {
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
}

(async () => {
  await sequelize.authenticate();
  const dataa = await models.message.findOne();
  console.log(dataa);
})();

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
