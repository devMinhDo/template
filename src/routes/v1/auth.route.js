const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const { authJwt } = require('../../middlewares/jwtAuth');

const router = express.Router();

router.post('/register/email', validate(authValidation.registerEmail), authController.registerEmail);
router.post('/login/email', validate(authValidation.loginEmail), authController.loginEmail);
router.post('/logout', authJwt, authController.logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
router.post('/send-verification-email', authController.sendVerificationEmail);
router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);
// router.post('/login/wallet', validate(authValidation.loginWallet), authController.loginWallet);
module.exports = router;
