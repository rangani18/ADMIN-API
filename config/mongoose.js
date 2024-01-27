const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1/ADMIN-API");

const db = mongoose.connection;

db.once('open', (err) => {
    if (err) console.log('db not connected!');
    console.log('db connected succesfully!');
});

module.exports = db;