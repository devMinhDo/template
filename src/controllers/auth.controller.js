const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const catchAsync = require('../utils/catchAsync');
// const web3 = require('../config/web3');
const { LOGIN_CODE } = require('../constants/auth.constant');
const { authService, userService, tokenService, emailService, historyLoginService } = require('../services');
const { getUserByEmail } = require('../services/user.service');
const { TreeContractModel } = require('../models');
const { OAuth2Client } = require('google-auth-library');
const appleSigninAuth = require('apple-signin-auth');
const registerEmail = catchAsync(async (req, res) => {
  await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send({ status: true, message: 'Registed success.' });
});

const loginEmail = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user.Address);
  const historyLogin = await historyLoginService.createNewHistory(user.Address, tokens, LOGIN_CODE.Email);
  return res.status(200).json({ status: true, data: { token: tokens } });
});

const logout = catchAsync(async (req, res) => {
  const { Address } = req.wallet;
  const status = await authService.logout(Address);
  return res.status(200).json({
    status,
  });
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await getUserByEmail(email);
  if (!user) return res.status(200).json({ status: false, message: 'User not found' });
  const newPassword = Math.random().toString(36).slice(-8);
  const salt = await bcrypt.genSaltSync(10);
  const hash = await bcrypt.hashSync(newPassword, salt);
  user.password = hash;

  await emailService.sendResetPasswordEmail(req.body.email, newPassword);
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
const verifyGoogleIdToken = async (req, res) => {
  try {
    const { idToken } = req.body;
    const data = await verify(idToken);
    if (!data) {
      return res.status(200).json({ status: false, message: 'Invalid idToken' });
    }
    let user = await TreeContractModel.findOne({ Email: data.user.email });
    if (!user) {
      user = await registerNewEmail(data.user.email);
    }
    let newToken = tokenService.generateAuthTokens(user.Address);
    await historyLoginService.createNewHistory(user.Address, newToken, 'GOOGLE');
    return res.status(200).json({ status: true, data: { token: newToken } });
  } catch (e) {
    console.log(e.message);
    return res.status(200).json({ status: false, message: 'Internal error server' });
  }
};
const verifyAppleIdToken = async (req, res) => {
  try {
    let { idToken, nonce } = req.body;
    const { createHash } = await import('node:crypto');
    nonce = nonce ? createHash('sha256').update(nonce).digest('hex') : undefined;
    const data = await appleSigninAuth.verifyIdToken(idToken, { nonce });
    if (!data) {
      return res.status(200).json({ status: false, message: 'Invalid idToken' });
    }
    let user = await TreeContractModel.findOne({ Email: data.email });
    if (!user) {
      user = await registerNewEmail(data.email);
    }
    let newToken = tokenService.generateToken(user.Address);
    await historyLoginService.createNewHistory(user.Address, newToken, 'APPLE');
    return res.status(200).json({ status: true, data: { token: newToken } });
  } catch (e) {
    console.log(e.message);
    return res.status(200).json({ status: false, message: 'Internal error server' });
  }
};
const verify = async (idToken) => {
  const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);
  let ticket = null;
  try {
    ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.OAUTH_CLIENT_ID,
    });
  } catch (e) {
    console.error('error:', e.message);
    return null;
  }
  const payload = ticket.getPayload();
  console.log('payload:', payload);
  return payload;
};
const registerNewEmail = async (email) => {
  try {
    const lastestTreeContractID = await TreeContractModel.findOne({}).sort({ ID: -1 });
    const randomAddress = '0x' + randomstring.generate().toLowerCase();
    const newUser = await new TreeContractModel({
      ID: lastestTreeContractID.ID + 1,
      Address: randomAddress,
      Email: email,
    }).save();
    return newUser;
  } catch (e) {
    console.log(e.message);
    return null;
  }
};
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
  verifyGoogleIdToken,
  verifyAppleIdToken,
};
