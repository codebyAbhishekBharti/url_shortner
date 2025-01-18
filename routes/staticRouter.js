const express = require('express');
const router = express.Router();
const URL = require('../models/urls');

router.get("/",async(req,res)=>{
    const allurls = await URL.find({});
    res.render("home",{
        urls: allurls,
    });
})
module.exports = router;