const register = require('../../../../model/Admin/adminmodel');

const manager = require('../../../../model/Manager/managermodel');

const nodemailer = require("nodemailer");

const bcrypt = require('bcrypt');

const jwtData = require('jsonwebtoken');

const path = require('path');

const fs = require('fs');

module.exports.add_manager = async(req,res)=>{
    try{
        let checkEmail = await manager.findOne({email: req.body.email });
        if(checkEmail){  
            return res.status(200).json({ msg: 'Email is already exist', status: 1 });
        }
            else{
                if(req.body.password == req.body.confirm_password){
                    const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth: {
                            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                            user: "khushalirangani18@gmail.com",
                            pass: "pzpduqppzoabmece",
                        },
                        }); 
                        const info = await transporter.sendMail({
                            from: "khushalirangani18@gmail.com", // sender address
                            to: req.body.email, // list of receivers
                            subject: "khushali", // Subject line
                            text: "Your Login Email and Password is here..", // plain text body
                            html: `<b> Email: ${req.body.email} </b><br>
                                   <b> Password: ${req.body.password} </b>` // html body
                            // html: '<a href="http://localhost:8525/admin/resetPassword">Reset Password</a>',
                        });
                    req.body.adminId = req.user.id;
                req.body.password = await bcrypt.hash(req.body.password,10);
                var imgpath = '';
                if (req.file) {
                    imgpath = manager.managerpath + '/' + req.file.filename;
                }
                req.body.img = imgpath;
                let managerData = await manager.create(req.body);
                if (managerData) {
                    let reg = await register.findById(req.user.id);
                    await reg.managerIds.push(managerData.id);
                    await register.findByIdAndUpdate(req.user.id,reg);
                    return res.status(200).json({ msg: 'Manager Record inserted!', status: 1, Data: managerData });
                }
                else {
                     return res.status(400).json({ msg: "Record is not inserted!", status: 0 });
                }
            }
        }
    }
    catch(err){
        console.log(err);
        return res.status(400).json({ masg: 'somthing wrong!', status: 0});
    }
}

module.exports.login = async(req,res)=>{
   try{
    let checkEmail = await manager.findOne({email: req.body.email });
    if(checkEmail){
        if(await bcrypt.compare(req.body.password, checkEmail.password));
        let managerToken = await jwtData.sign({managerData: checkEmail},
            'Manager',{expiresIn: '1h'});
        return res.status(200).json({msg: 'login succesfully!',status: 1, Token: managerToken});
    }
    else{
        return res.status(200).json({ msg: 'Email is already exist', status: 0 });
    }
   }
   catch(err){
        return res.status(400).json({ msg: 'somthing wrong!', status: 0});
   }
}

module.exports.viewAllManager = async(req,res)=>{
    try{
        let managerData = await manager.find({});
            if (managerData) {
                return res.status(200).json({ msg: 'Records are here!', status: 1, Data: managerData });
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
        let managerData = await manager.findById(req.user.id).populate('adminId').exce();
        return res.status(200).json({ msg: 'Manager Record is here!', status: 1, Data: managerData }); 
    }
    catch(err){
        return res.status(400).json({ msg: 'somthing wrong!', status: 0});
    }
}

module.exports.editProfile = async(req,res)=>{
    try{
        let oldData = await manager.findById(req.params.id);
        if(req.file){
            if(oldData.img){
                let fullPath = path.join(__dirname, '../../../..', oldData.img);
                await fs.unlinkSync(fullPath);
            }
            var imgpath = '';
            imgpath = manager.managerpath + '/' + req.file.filename;
            req.body.img = imgpath;
        }
        else{
            req.body.img = oldData.img;
        }
            await manager.findByIdAndUpdate(req.params.id, req.body);
            return res.status(400).json({ msg: 'updated succesfully!', status: 1, Data: req.body});
    }
    catch(err){
        console.log(err);
        return res.status(400).json({ msg: 'somthing wrong!', status: 0});
    }
}