const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const moment = require('moment/moment');
const config = require('../config/config');
const { TreeContractModel, Version } = require('../models');
const { historyLoginService } = require('../services');

module.exports.authJwt = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      status: false,
      message: 'No token Bearer',
    });
  }
  if (!token.startsWith('Bearer')) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: false,
      message: 'Token start with Bearer',
    });
  }
  token = token.split(' ')[1];
  console.log('check',token);
  try {
    const { Email } = jwt.verify(token, config.jwt.secret);
    const wallet = await TreeContractModel.findOne({ Email });
    if (!wallet)
      return res.status(httpStatus.BAD_REQUEST).json({
        status: false,
        message: `Don't find user in system`,
      });
    if (wallet.Blocked)
      return res.status(200).json({
        status: false,
        message: `Your account is temporarily locked due to detecting misconduct. Please contact support@herobook.io for more details!.`,
      });

    const checkSessionLogin = await historyLoginService.findLastSessionTokenLogin(Email);
    console.log('check token :',checkSessionLogin)
    if (token !== checkSessionLogin.token)
      return res.status(httpStatus.UNAUTHORIZED).json({
        status: false,
        message: 'This session is login before. You are login in many places!!!',
      });

    const checkMaintain = await Version.findOne({});
    if (checkMaintain && checkMaintain.maintain === 1) {
      if (!checkMaintain.whitelist.includes(Address))
        return res.status(200).json({
          status: true,
          message: `The system is maintenance!. Please try again in another time.`,
        });
    }
    req.wallet = wallet;
    next();
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json({ status: false, message: err.message });
  }
};

module.exports.generateJWT = async (Address) => {
  Address = Address.toLowerCase();
  const expireTime = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const payload = {
    Address,
    iat: moment().unix(),
    exp: expireTime.unix(),
  };
  try {
    return jwt.sign(payload, config.jwt.secret);
  } catch (error) {
    return error;
  }
};
