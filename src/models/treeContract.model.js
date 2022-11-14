const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const treeSchema = mongoose.Schema(
  {
    ID: {
      type: Number,
      required: true,
      unique: [true, 'ID is taken.'],
    },
    Wallet: {
      type: Array,
      default: [],
    },
    Address: {
      type: String,
      default: null,
    },
    Email: {
      type: String,
      default: null,
    },
    Password: {
      type: String,
      default: null,
    },
    Jwt_Token: {
      type: String,
    },
    Blocked: {
      type: Boolean,
      default: false,
    },
    Username: {
      type: String,
      default: null,
    },
    Point: {
      type: Number,
      default: 0,
    },
    Avatar: {
      type: String,
      default: '',
    },
    IsVerifyMail: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

treeSchema.plugin(toJSON);
treeSchema.plugin(paginate);

treeSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

treeSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

treeSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

module.exports = mongoose.model('tree_contract', treeSchema);
