const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const session = require("express-session");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError.js");
require('dotenv').config();

// Import configurations
const connectDB = require("./config/database.js");
require("./config/passport.js")(passport);

// Import routes
const userRoutes = require("./routes/user.js");
const projectRoutes = require("./routes/project.js");
const indexRoutes = require("./routes/index.js");

//---------view engine setup-----------------------------------------------------

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

//---------session configuration------------------------------------------------

const sessionOptions = {
    secret: process.env.SESSION_SECRET || "mysupersecretsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// Add notification count middleware
const { addNotificationCount } = require("./utils/middleware.js");
app.use(addNotificationCount);

//---------database connection---------------------------------------------------

connectDB();

// Make io accessible to routes
app.set('io', io);

// ==================== Socket.io Configuration ====================
// Initialize Socket.io handlers from separate folder
require('./socket')(io);

// ==================== Routes ====================
app.use("/", indexRoutes);
app.use("/", userRoutes);
app.use("/projects", projectRoutes);

// ==================== Error Handling ====================
app.use((req, res, next) => {
    next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    console.error('❌ Error occurred:', {
        statusCode,
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method
    });
    
    // Log full error for debugging
    console.error('Full error:', err);
    
    // Send JSON response for API requests
    if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
        return res.status(statusCode).json({
            success: false,
            error: message,
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
    
    res.status(statusCode).render("main/404.ejs");
});

// ==================== Start Server ====================
server.listen(5000, () => {
    console.log("✓ Server listening on port 5000");
    console.log("✓ Socket.io ready for real-time chat");
    console.log("http://localhost:5000");
});

