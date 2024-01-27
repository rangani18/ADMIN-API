const mongoose = require('mongoose');

const multer = require('multer');

const imgpath = '/uploads/Manager';

const path = require('path');

const managerSchema = mongoose.Schema({
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
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Register',
    required: true,
  }
});

const managerstore = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../..", imgpath));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  }
});

managerSchema.statics.uploadimg = multer({ storage: managerstore }).single("img");
managerSchema.statics.managerpath = imgpath;

const manager = mongoose.model('Manager', managerSchema);

module.exports = manager;