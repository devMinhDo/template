const { HistoryLoginModel } = require('../models');

const createNewHistory = async (address, token, code) => {
  return await HistoryLoginModel.create({
    address,
    token,
    loginTime: new Date().getTime(),
    isLogin: true,
    code,
  });
};

const findLastSessionTokenLogin = async (address) => {
  const history = await HistoryLoginModel.find({ address }).sort({ createdAt: -1 }).limit(1);
  return history[0];
};

const findOneFilter = async(filter) =>{
  return await this.HistoryLoginModel.find(filter)
}

module.exports = {
  createNewHistory,
  findLastSessionTokenLogin,
  findOneFilter
};

