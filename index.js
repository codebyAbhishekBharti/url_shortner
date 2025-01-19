const express = require('express');
const urlRoute = require('./routes/urls');
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user');
const cookieParser = require('cookie-parser');
const { restrictToLoggedinUserOnly, checkAuth } = require('./middleware/auth');
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
app.use(cookieParser());

app.use("/url",restrictToLoggedinUserOnly,urlRoute);
app.use("/", staticRoute); 
app.use("/url/:shortID", handleRedirectToOriginalURL);
app.use("/user",checkAuth, userRoute);

app.listen(port, () => {console.log(`Server is running on port ${port}`);});