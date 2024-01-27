const express = require('express');

const routes = express.Router();

const passport = require('passport');

const manager = require('../../../../model/Manager/managermodel')

const managerController = require('../../../../controller/API/v1/Manager/managerController');

routes.post('/add_manager',passport.authenticate('jwt',{failureRedirect: '/admin/manager/failAdminLogin'}), manager.uploadimg, managerController.add_manager);

routes.post('/login',managerController.login);

routes.get('/viewAllManager',passport.authenticate('manager',{failureRedirect: '/admin/manager/failManagerLogin'}),managerController.viewAllManager);

routes.get('/profile',passport.authenticate('manager',{failureRedirect: '/admin/manager/failManagerLogin'}),managerController.profile);

routes.patch('/editProfile/:id',passport.authenticate('manager',{failureRedirect: '/admin/manager/failManagerLogin'}), manager.uploadimg, managerController.editProfile);

routes.get('/failAdminLogin',async (req,res)=>{
    return res.status(400).json({ msg: "Invalid Login!", status: 0 });
});

routes.get('/failManagerLogin',async (req,res)=>{
    return res.status(400).json({ msg: "Invalid Login!", status: 0 });
});

module.exports = routes;