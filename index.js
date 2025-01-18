const express = require('express');
const urlRoute = require('./routes/urls');
const staticRoute = require('./routes/staticRouter');
const connectMongoDB = require('./connect');
const URL = require('./models/urls');
const {handleRedirectToOriginalURL} = require('./controllers/urls');
const path = require('path');
const app = express();
const port = 8001;

connectMongoDB("mongodb://localhost:27017/short-url").then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB", err);
});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test", async(req, res) => {
    const allUrls = await URL.find({});
    res.render("home",{
        urls: allUrls,
    });
    // res.end(`
    //     <html>
    //     <head></head>
    //     <body>
    //         <h1>Hey from server</h1>
    //         <ul>
    //             ${allUrls.map((url) => {
    //                 return `<li>${url.shortId} link - ${url.redirectURL} - ${url.visitHistory.length} </li>`;
    //             })}
    //         </ul>
    //     </html>    
    // `)
});

app.use("/url",urlRoute)
app.use("/", staticRoute); 
app.use("/url/:shortID", handleRedirectToOriginalURL);

app.listen(port, () => {console.log(`Server is running on port ${port}`);});