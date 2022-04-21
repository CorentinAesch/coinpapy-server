const router = require("express").Router();
const mongoose = require("mongoose");
const fileUploader = require('../config/cloudinary.config');

const bcrypt = require("bcrypt");

const saltRounds = 10;

const User = require("../models/User.model");


router.get("/:userId/edit", (req, res, next) => {
    const {userId} = req.params
    User.findOne({_id:userId})
    .then(user => {
        res.render("profile/edit", {userId,user});
    })
    .catch(err => console.log(err));
});

router.post("/:userId/edit", fileUploader.single('profile-picture'), (req, res, next) => {

    const { email,firstName,lastName, existingImage } = req.body;
    const { userId } = req.params;
    let {darkmode} = req.body;
    
    (async () =>{

        try{

            let profileImage = req.file ? req.file.path : existingImage;
            darkmode = darkmode === 'on' ? true:false;

            console.log(profileImage);

            if(!email) throw 'Please provide your email.';

            const user = await User.findOneAndUpdate({_id:userId},{email,firstName,lastName,profileImage,darkmode}, {new: true});
            console.log(user);
            req.session.user = {
                id:user._id,
                name:user.firstName,
                image:user.profileImage,
                darkmode: user.darkmode,
                active:user.active,
            };
            res.locals.connectedUser = req.session.user;

            res.render("profile/edit", {userId,user:{ email,firstName,lastName,profileImage,darkmode },success:{message:'Successfully updated your profile.'}});

        }catch(err){
            console.log(err);
            return res.status(400).render('profile/edit', { userId, errors: {profile:{message:err}}, user:{ email,firstName,lastName,profileImage }});
        }

    })();

});

router.get("/:userId/edit/password", (req, res, next) => { 
    const { userId } = req.params;
    if(!userId) res.redirect(`/`);
    res.redirect(`/profile/${userId}/edit`);
});

router.post("/:userId/edit/password", (req, res, next) => {

    console.log('Updating Password');
    
    const { oldPassword,password,repeatPassword } = req.body;
    const { userId } = req.params;

    

    ( async () =>{

        try{
            
            if(!oldPassword)throw 'We need your old password';

            let user = await User.findOne({id:userId});
            const isSamePassword = await bcrypt.compare(oldPassword, user.password)

            if (!isSamePassword) throw 'Your old password is not correct.';
            if(password !== repeatPassword) throw 'Repeat your new password correctly';
            if (password.length < 8)  throw "Your password needs to be at least 8 characters long.";
            if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(password)) throw "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.";

            const salt = await bcrypt .genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(password, salt);
            user = await User.findOneAndUpdate({_id:userId},{password:hashedPassword}, { new: true });

            console.log(user);
            res.render("profile/edit", {userId,user,success:{message:'Successfully updated your password.'}});
            
        }catch(err){
            return res.status(400).render('profile/edit', { userId, errors: {password:{message:err}}, form:{ oldPassword,password,repeatPassword }});
        }

    })();

    
});

module.exports = router;