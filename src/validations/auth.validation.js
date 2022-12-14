const Joi = require('joi');
const { password } = require('./custom.validation');

const registerEmail = {
  body: Joi.object().keys({
    Email: Joi.string().required().email(),
    Password: Joi.string().required().custom(password),
    Username: Joi.string().required(),
  }),
};

const loginEmail = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};
const verifyGoogle = {
  body: Joi.object().keys({
    idToken: Joi.string().required(),
  }),
};

const verifyApple = {
  body: Joi.object().keys({
    idToken: Joi.string().required(),
    nonce: Joi.string().required(),
  }),
};

const loginWallet = {
  query: Joi.object().keys({
    wallet: Joi.string().required(),
    sign: Joi.string().required(),
  }),
};

module.exports = {
  registerEmail,
  loginEmail,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  loginWallet,
  verifyGoogle,
  verifyApple,
};
