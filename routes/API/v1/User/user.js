const express = require('express');

const routes = express.Router();

const passport = require('passport');

const user = require("../../../../model/User/usermodel");

const userController = require('../../../../controller/API/v1/User/userController');

routes.post('/add_user', user.uploadimg, userController.add_user);

routes.post('/login',userController.login);

routes.get('/profile',passport.authenticate('user',{failureRedirect:'/user/failLogin'}), userController.profile);

routes.patch('/editProfile/:id',passport.authenticate('user',{failureRedirect: '/admin/user/failUserLogin'}), user.uploadimg, userController.editProfile);

routes.get('/failLogin',async (req,res)=>{
    return res.status(400).json({ msg: "Invalid Login!", status: 0 });
});

routes.get('/failUserLogin',async(req,res)=>{
    return res.status(400).json({ msg: "Invalid Login!", status: 0 });
})

module.exports = routes;