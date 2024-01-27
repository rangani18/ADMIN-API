const express = require('express');

const routes = express.Router();

const passport = require('passport');

const admin = require("../../../../model/Admin/adminmodel");

const adminController = require("../../../../controller/API/v1/Admin/adminController");

routes.post('/registration', admin.uploadimg, adminController.registration);

routes.get('/login', adminController.login);

routes.get('/viewAlladmin',passport.authenticate('jwt',{failureRedirect: '/admin/failLogin'}), adminController.viewAlladmin);

routes.get('/profile',passport.authenticate('jwt',{failureRedirect:'/admin/failLogin'}), adminController.profile);

routes.put('/editProfile/:id', passport.authenticate('jwt',{failureRedirect:'/admin/failLogin'}), admin.uploadimg, adminController.editProfile);

routes.get('/failLogin',async (req,res)=>{
    return res.status(400).json({ msg: "Invalid Login!", status: 0 });
});

routes.use('/manager',require('../Manager/manager'));

routes.use('/user',require('../User/user'));

module.exports = routes;