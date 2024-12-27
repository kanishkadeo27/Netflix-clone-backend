// register and login method
const router = require("express").Router();
const User = require('../models/User');
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');

//REGISTER
//creating-post
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString(),
    });
    console.log(newUser);
    try {
        const user = await newUser.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});


//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user =await User.findOne({ email: req.body.email });
        !user && res.status(401).json("wrong password or username");

        //if user exists validate password
        var bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        var originalPassword = bytes.toString(CryptoJS.enc.Utf8);

        originalPassword !== req.body.password && res.status(401).json("wrong password or username");

        const accessToken = jwt.sign({id:user._id , isAdmin:user.isAdmin} , process.env.SECRET_KEY , {expiresIn:"5d"})
        //not to send password as we will store it in our local storage
        const{password, ...info} = user._doc;

        res.status(200).json({...info,accessToken});

    } catch (error) {
        res.status(500).json(error);
    }
});


module.exports = router;