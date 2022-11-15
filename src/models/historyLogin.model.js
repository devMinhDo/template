const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const historyLoginSchema = new mongoose.Schema(
  {
    address: {
      type: String,
    },
    Email: {
      type: String,
    },
    token: {
      type: String,
    },
    loginTime: {
      type: Date,
      default: new Date().getTime(),
    },
    logoutTime: {
      type: Date,
      default: new Date().getTime(),
    },
    isLogin: {
      type: Boolean,
      default: false,
    },
    code: {
      type: String,
    },
    ip: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

historyLoginSchema.plugin(toJSON);
historyLoginSchema.plugin(paginate);

const HistoryLogin = mongoose.model('HistoryLogin', historyLoginSchema);

module.exports = HistoryLogin;
