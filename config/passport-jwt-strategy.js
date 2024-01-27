const passport = require("passport");

const JwtStrategy = require('passport-jwt').Strategy;

const ExtractJwt = require('passport-jwt').ExtractJwt;

const admin = require('../model/Admin/adminmodel');

const manager = require("../model/Manager/managermodel");

const user = require("../model/User/usermodel");

var opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'khushi',
}

var opts1 = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'Manager',
}

var opts2 = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'User',
}

passport.use(new JwtStrategy(opts, async(record,done)=>{
    let checkAdmin = await admin.findById(record.data._id);
    if(checkAdmin){
        return done(null,checkAdmin);
    }
    else{
        return done(null,false);
    }
}));

passport.use('manager', new JwtStrategy(opts1, async(record,done)=>{
    let checkManager = await manager.findById(record.managerData._id);
    if(checkManager){
        return done(null,checkManager);
    }
    else{
        return done(null,false);
    }
}));

passport.use('user', new JwtStrategy(opts2, async(record,done)=>{
    let checkUser = await user.findById(record.userData._id);
    if(checkUser){
        return done(null,checkUser);
    }
    else{
        return done(null,false);
    }
}));

passport.serializeUser(async function(user,done){
    return done(null,user.id);
});

passport.deserializeUser(async function(id,done){
    let recheck = await admin.findById(id);
    if(recheck){
        return done(null,recheck);
    }
    else{
        return done(null,false);
    }
})

module.exports = passport;

