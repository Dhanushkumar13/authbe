const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const router = express.Router();

//Register
router.post('/register', async(req,res)=>{
    const {name, email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({msg:'User already exists'});
        }

        user = new User({name, email, password});
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {user: {id: user.id}};
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 360000}, (err,token)=>{
            if(err) throw err;
            res.json({token});
        });
    } catch (error) {
        res.status(500).json({msg:'Server error', error})
    }
});

//Login
router.post('/login', async(req,res)=>{
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg:'Invalid Credentials'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({msg:'Invalid Credentials'});
        }

        const payload = {user: {id: user.id}};
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 360000}, (err,token)=>{
            if(err) throw err;
            res.json({token});
        })

    } catch (error) {
        res.status(500).json({msg:'Server error'});
    }
});

//User Profile
router.get('/profile', async(req,res)=>{
    const user = User.findById(req.user.id).select('-password');
    res.json(user);
});

module.exports = router;