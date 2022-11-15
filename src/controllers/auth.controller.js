const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
// const web3 = require('../config/web3');

const { LOGIN_CODE } = require('../constants/auth.constant');
const { authService, userService, tokenService, emailService, historyLoginService } = require('../services');
// const { TreeContractModel } = require('../models/index');

const registerEmail = catchAsync(async (req, res) => {
  await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send({ status: true, message: 'Registed success.' });
});

const loginEmail = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(email);
 const historyLogin = await historyLoginService.createNewHistory(user.Email, tokens, LOGIN_CODE.Email);
  return res.status(200).json({ status: true, data: { token: tokens } });
});

const logout = catchAsync(async (req, res) => {
  const { Email } = req.wallet;
  const status = await authService.logout(Email);
  return res.status(200).json({
    status,
  });
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

// const loginWallet = catchAsync(async (req, res) => {
//   try {
//     let { wallet } = req.body;
//     const { sign } = req.body;
//     wallet = wallet ? wallet.toLowerCase() : wallet;
//     const is_registed = await TreeContractModel.findOne({ Address: wallet });
//     if (!sign) return res.status(200).json({ status: true, data: { sign: process.env.LOGIN_SIGN } });
//     let data = web3.eth.accounts.recover(process.env.LOGIN_SIGN, sign);
//     if (data.toLowerCase() !== wallet.toLowerCase()) {
//       data = web3.eth.accounts.recover(web3.utils.toChecksumAddress(wallet), sign); // process.env.SIGN
//       if (data.toLowerCase() !== wallet.toLowerCase())
//         return res.status(200).json({ status: false, message: 'Sign is not correct', data: { registed: false } });
//     }
//     const newToken = await tokenService.generateJWT(is_registed.Address);
//     await historyLoginService.createNewHistory(is_registed.Address, newToken, LOGIN_CODE.Address);
//     return res.status(200).json({ status: true, data: { token: newToken } });
//   } catch (error) {
//     return res.status(500).json({ status: false, message: error.message });
//   }
// });

module.exports = {
  loginEmail,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  registerEmail,
  // loginWallet,
};
