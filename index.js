const express = require('express');

const port = 8001;

const app = express();

app.use(express.urlencoded());

const db = require('./config/mongoose');

const session = require('express-session');

const passport = require('passport');

const jwtpassport = require('./config/passport-jwt-strategy');

const register = require('./model/Admin/adminmodel');

app.use(session({
    name: 'khushi',
    secret: 'khushi',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*10*100,
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/admin',require('./routes/API/v1/Admin/admin'));

app.listen(port, (err) => {
    if (err) console.log('something wrong!');
    console.log('Server Running on port:',port);
});