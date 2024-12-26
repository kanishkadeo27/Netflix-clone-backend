// register and login method
const router = require("express").Router();
const User = require('../models/User');
const CryptoJS = require("crypto-js");


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

module.exports = router;