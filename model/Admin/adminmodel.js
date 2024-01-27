const mongoose = require('mongoose');

const multer = require('multer');

const imgpath = '/uploads/Admin';

const path = require('path');

const regiSchema = mongoose.Schema({
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
  managerIds:{
    type: Array,
    ref: 'Manager',
  }
});

const adminstore = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../..", imgpath));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  }
});

regiSchema.statics.uploadimg = multer({ storage: adminstore }).single("img");
regiSchema.statics.regipath = imgpath;

const register = mongoose.model('Register', regiSchema);

module.exports = register;