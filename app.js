const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: process.env.BASE_URL || "http://localhost:5000",
        methods: ["GET", "POST"],
        credentials: true
    }
});
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const flash = require("connect-flash");
const helmet = require("helmet");
const ExpressError = require("./utils/ExpressError.js");
require('dotenv').config();

// Import configurations
const connectDB = require("./config/database.js");
require("./config/passport.js")(passport);

// Import routes
const userRoutes = require("./routes/user.js");
const projectRoutes = require("./routes/project.js");
const indexRoutes = require("./routes/index.js");

//---------Production Configuration----------------------------------------------

// Trust proxy for secure cookies behind reverse proxies (Heroku, Railway, etc.)
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable for now to avoid issues with inline scripts
    crossOriginEmbedderPolicy: false // Allow embedding resources
}));

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
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_DB_ATLAS,
        touchAfter: 24 * 3600, // Lazy session update (seconds)
        crypto: {
            secret: process.env.SESSION_SECRET || "mysupersecretsecret"
        }
    }),
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' // Only send cookie over HTTPS in production
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
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`✓ Server listening on port ${PORT}`);
    console.log("✓ Socket.io ready for real-time chat");
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    if (process.env.NODE_ENV !== 'production') {
        console.log(`http://localhost:${PORT}`);
    }
});

// ==================== Graceful Shutdown ====================
// Handle graceful shutdown for hosting platforms
const gracefulShutdown = (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    
    server.close(() => {
        console.log('✓ HTTP server closed');
        
        // Close database connection
        const mongoose = require('mongoose');
        mongoose.connection.close(false, () => {
            console.log('✓ MongoDB connection closed');
            process.exit(0);
        });
    });
    
    // Force shutdown after 10 seconds
    setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit in production, just log
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
});
