const mongoose = require('mongoose');

const multer = require('multer');

const imgpath = '/uploads/User';

const path = require('path');

const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  img: {
    type: String,
  },
});

const userstore = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../..", imgpath));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  }
});

userSchema.statics.uploadimg = multer({ storage: userstore }).single("img");
userSchema.statics.userpath = imgpath;

const user = mongoose.model('user', userSchema);

module.exports = user;