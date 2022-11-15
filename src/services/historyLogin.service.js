const { HistoryLoginModel } = require('../models');

const createNewHistory = async (address, token, code) => {
  return HistoryLoginModel.create({
    address,
    token,
    loginTime: new Date().getTime(),
    isLogin: true,
    code,
  });
};

const findLastSessionTokenLogin = async (Email) => {
  const history = await HistoryLoginModel.find({ Email }).sort({ createdAt: -1 }).limit(1);
  return history[0];
};

const findOneFilter = async (filter) => {
  return this.HistoryLoginModel.find(filter);
};

module.exports = {
  createNewHistory,
  findLastSessionTokenLogin,
  findOneFilter,
};
