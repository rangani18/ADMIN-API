const user = require('../../../../model/User/usermodel');

const bcrypt = require('bcrypt');

const jwtData = require('jsonwebtoken');

const path = require('path');

const fs = require('fs');

module.exports.add_user = async(req,res)=>{
    try{
        let checkEmail = await user.findOne({email: req.body.email });
        if(checkEmail){
            return res.status(200).json({ msg: 'Email is already exist', status: 1 });
        }
        else{
            if(req.body.password == req.body.confirm_password){
            req.body.password = await bcrypt.hash(req.body.password,10);
            var imgpath = '';
            if (req.file) {
                imgpath = user.userpath + '/' + req.file.filename;
            }
            req.body.img = imgpath;
            let userData = await user.create(req.body);
            if (userData) {
                return res.status(200).json({ msg: 'Record inserted!', status: 1, Data: userData });
            }
            else {
                 return res.status(400).json({ msg: "something Wrong!", status: 0 });
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
        let checkEmail = await user.findOne({email: req.body.email });
        if(checkEmail){
            if(await bcrypt.compare(req.body.password, checkEmail.password));
            let userToken = await jwtData.sign({userData: checkEmail},
                'User',{expiresIn: '1h'});
            return res.status(200).json({msg: 'login succesfully!',status: 1, Token: userToken});
        }
        else{
            return res.status(200).json({ msg: 'Email is already exist', status: 0 });
        }
       }
       catch(err){
            return res.status(400).json({ msg: 'somthing wrong!', status: 0});
       }
}

module.exports.profile = async(req,res)=>{
    try{
        return res.status(200).json({ msg: 'User Record is here!', status: 1, Data: req.user }); 
    }
    catch(err){
        return res.status(400).json({ msg: 'somthing wrong!', status: 0});
    }
}

module.exports.editProfile = async(req,res)=>{
    try{
        let oldData = await user.findById(req.params.id);
        if(req.file){
            if(oldData.img){
                let fullPath = path.join(__dirname, '../../../..', oldData.img);
                await fs.unlinkSync(fullPath);
            }
            var imgpath = '';
            imgpath = user.userpath + '/' + req.file.filename;
            req.body.img = imgpath;
        }
        else{
            req.body.img = oldData.img;
        }
            await user.findByIdAndUpdate(req.params.id, req.body);
            return res.status(400).json({ msg: 'updated succesfully!', status: 1, Data: req.body});
    }
    catch(err){
        console.log(err);
        return res.status(400).json({ msg: 'somthing wrong!', status: 0});
    }
}