const express = require('express');
const router = express.Router();
const URL = require('../models/urls');
const { getUser } = require('../service/auth');

router.get("/",async(req,res)=>{
    const user = getUser(req.cookies.uid)
    if(!user){
        return res.redirect("/login");
    }
    else{
        const allurls = await URL.find({createdBy: user._id});
        res.render("home",{
            urls: allurls,
        });
    }   
})

router.get("/signup",(req,res)=>{
    res.render("signup");
})

router.get("/login",(req,res)=>{
    res.render("login");
})

module.exports = router;