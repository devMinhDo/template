var DataTypes = require('sequelize').DataTypes;
var _conversation = require('./conversation');
var _message = require('./message');

function initModels(sequelize) {
  var conversation = _conversation(sequelize, DataTypes);
  var message = _message(sequelize, DataTypes);

  return {
    conversation,
    message,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
