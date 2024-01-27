const register = require("../../../../model/Admin/adminmodel");

const bcrypt = require('bcrypt');

const jwtData = require('jsonwebtoken');

const path = require('path');

const fs = require('fs');

module.exports.registration = async(req,res)=>{
    try{
        let checkEmail = await register.findOne({email: req.body.email });
        if(checkEmail){
            return res.status(200).json({ msg: 'Email is already exist', status: 1 });
        }
        else{
            if(req.body.password == req.body.confirm_password){
            req.body.password = await bcrypt.hash(req.body.password,10);
            var imgpath = '';
            if (req.file) {
                imgpath = register.regipath + '/' + req.file.filename;
            }
            req.body.img = imgpath;
            let regiData = await register.create(req.body);
            if (regiData) {
                return res.status(200).json({ msg: 'Record inserted!', status: 1, Data: regiData });
            }
            else {
                 return res.status(400).json({ msg: "something Wrong!", status: 0 });
            }
        }
    }
    }
    catch(err){
        return res.status(400).json({ masg: 'somthing wrong!', status: 0});
    }
}

module.exports.login = async (req,res)=>{
    try{
        let checkEmail = await register.findOne({email: req.body.email });
        if(checkEmail){
            if(await bcrypt.compare(req.body.password,checkEmail.password)){
                let token = await jwtData.sign({data: checkEmail},
                'khushi',{expiresIn: '1h'});
                return res.status(200).json({msg: 'login succesfully!',status: 1, Token: token});
            }
        }
        else{
            return res.status(200).json({ msg: 'Email is already exist', status: 0 });
        }
    }
    catch(err){
        return res.status(400).json({ msg: 'somthing wrong!', status: 0});
    }
}

module.exports.viewAlladmin = async(req,res)=>{
    try{
        let regiData = await register.find({});
            if (regiData) {
                return res.status(200).json({ msg: 'Records are here!', status: 1, Data: regiData });
            }
            else {
                 return res.status(400).json({ msg: "something Wrong!", status: 0 });
           }
        }
    catch(err){
        return res.status(400).json({ msg: 'somthing wrong!', status: 0});
    }
}

module.exports.profile = async(req,res)=>{
    try{
        let adminData = await register.findById(req.user.id).populate('managerIds').exce();
        return res.status(200).json({ msg: 'Admin Record is here!', status: 1, Data: adminData });
    }
    catch(err){
        console.log(err);
        return res.status(400).json({ msg: 'somthing wrong!', status: 0});
    }
}

module.exports.editProfile = async(req,res)=>{
    try{
        if(req.file){
            let oldData = await register.findById(req.params.id);
            if(oldData.img){
                let fullPath = path.join(__dirname,'../../../..', oldData.img);
                await fs.unlinkSync(fullPath);
            }
            var imgpath = '';
                imgpath = register.regipath + '/' + req.file.filename;
                req.body.img = imgpath;
        }
        else{
            let oldData = await register.findById(req.params.id);
            req.body.img = oldData.img;
        }
            await register.findByIdAndUpdate(req.params.id,req.body);
            return res.status(400).json({ msg: 'update succesfully!', status: 1, Data: req.body});
    }
    catch(err){
        return res.status(400).json({ msg: 'somthing wrong!', status: 0});
    }
}