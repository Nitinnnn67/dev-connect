const express= require("express");
const app = express();
const session = require("express-session");
// const mongoose=require("mongoose")
// const methodOverride = require("method-override")
const path = require("path");
const ejsMate=require("ejs-mate");
// const wrapAsync  = require ("./utils/wrapAsync.js");
// const ExpressError  = require ("./utils/ExpressError.js");
// require('dotenv').config();


app.set("view engine","ejs")
app.set("views", path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(express.json()); // Add JSON body parser for AI insights
// app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname, "public")));

//---------session configuration--------------------------
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "mysupersecretsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOptions));
// app.use(flash());


app.get("/", (req, res) => {
    res.render("main/landing.ejs");
});



//--------error handling-------------------------------
// app.use((req,res,next)=>{
// next(new ExpressError(404,"page not found"))
// })

// app.use((err,req,res,next)=>{
// let {statusCode=500,message="something went wrong"}=err;
//  res.status(statusCode).render("diary/404.ejs");
// // res.status(statusCode).send(message);
// })

app.listen(5000,()=>{
    console.log("listening on port 5000");
})

