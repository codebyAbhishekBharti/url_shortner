const express = require('express');
const urlRoute = require('./routes/urls');
const connectMongoDB = require('./connect');
const URL = require('./models/urls');

const app = express();
const port = 8001;

connectMongoDB("mongodb://localhost:27017/short-url").then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB", err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/url",urlRoute)
app.use("/:shortID", async(req,res)=>{
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
});

app.listen(port, () => {console.log(`Server is running on port ${port}`);});