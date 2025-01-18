const shortid = require('shortid');
const URL = require('../models/urls');
async function handleGenerateNewShortURL(req,res) {
    const shortID = shortid();
    const allurls = await URL.find({});
    const body = req.body;
    if(!body.url) return res.status(400).json({message: "URL is required"});
    const checkAlreadyExists = await URL.findOne({redirectURL: body.url});
    if(checkAlreadyExists){
        return res.render("home",{
            id: checkAlreadyExists.shortID,
            urls: allurls,
        })
    }
    else{
        await URL.create({
            shortID: shortID,
            redirectURL: body.url,
            visitHistory: [],
        })
        return res.render("home",{
            id: shortID,
            urls: allurls,
        })
    }
    
}

async function handleRedirectToOriginalURL(req,res) {
    const shortID = req.params.shortID;
    const entry = await URL.findOneAndUpdate(
        {
        shortID: shortID
        },
        {
        $push: {visitHistory: {timestamp: Date.now()}}
        }
    )
    if(!entry) return res.status(404).json({message: "Short URL not found"});
    return res.redirect(entry.redirectURL); 
}

async function handleGetAnalytics(req,res) {
    const shortID = req.params.shortID;
    const entry = await URL.findOne({shortID: shortID});
    if(!entry) return res.status(404).json({message: "Short URL not found"});
    return res.json({totalClicks: entry.visitHistory.length, visitHistory: entry.visitHistory});
}

module.exports = {handleGenerateNewShortURL, handleGetAnalytics, handleRedirectToOriginalURL};