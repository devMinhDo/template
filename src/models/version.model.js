const mongoose = require('mongoose');

const VersionSchema = mongoose.Schema(
  {
    maintain: {
      type: Number,
      default: 0,
    },
    whitelist: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json

const Version = mongoose.model('version', VersionSchema);

module.exports = Version;
