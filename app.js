const express= require("express");
const app = express();
const session = require("express-session");
const mongoose=require("mongoose")
const methodOverride = require("method-override")
const path = require("path");
const ejsMate=require("ejs-mate");
const wrapAsync  = require ("./utils/wrapAsync.js");
const ExpressError  = require ("./utils/ExpressError.js");
const Project = require("./models/project.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");
const flash = require("connect-flash");
require('dotenv').config();

//--------------------Routes--------------------------------------------

const userRoutes = require("./routes/user.js");
const { isLoggedin } = require("./utils/middleware.js");

//---------view engine setup-----------------------------------------------------

app.set("view engine","ejs")
app.set("views", path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(express.json()); // Add JSON body parser for AI insights
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
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
}
//-------------------------------------------------------------------------------

app.use(session(sessionOptions));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Make flash messages and user available to all views
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

//---------database connection---------------------------------------------------

const dbUrl= process.env.MONGO_DB_ATLAS;
main().then((res)=>{
    console.log("connected to database: Dev-Connect");

    // Initialize the database with a test entry if it's empty
    Project.countDocuments().then((count) => {
        if (count === 0) {
            const testProject = new Project({
                title: "DevConnect",
                description: "Developer collaboration platform",
                requiredSkills: ["node", "express", "mongodb"],
                createdBy: new mongoose.Types.ObjectId(),      
                members: [],          
                status: "open",               
                createdAt: Date.now()
            });
            testProject.save().then(() => console.log("Test project created"));
        }
    });
})
.catch((err)=>{
    console.log("Database connection error:", err.message);
});

async function main() {
   try {
       await mongoose.connect(dbUrl);
       console.log("MongoDB connected successfully");
   } catch (error) {
       console.log("MongoDB connection failed:", error);
       throw error;
   }
}

//-----------------------------------------------------------------
// Landing page
app.get("/", wrapAsync(async(req, res) => {
    res.render("main/landing.ejs");
}));
//----------------------------------------------------------------- 
app.use("/", userRoutes);
//-----------------------------------------------------------------
// Authentication routes
// app.get("/login", wrapAsync(async(req,res) => {
//     res.render("main/login.ejs")
// }));

// app.post("/login", wrapAsync(async(req, res) => {
//     const { email, password } = req.body;
    // Authentication logic
//     res.redirect("/home");
// }));

// app.get("/register", wrapAsync(async(req,res) => {
//     res.render("main/register.ejs")
// }));

// app.post("/register", wrapAsync(async(req, res) => {
//     const { name, email, password, skills, bio } = req.body;
    // Create new user with skills
//     res.redirect("/login");
// }));

// app.get("/logout", wrapAsync(async(req, res) => {
//     req.session.destroy();
//     res.redirect("/");
// }));
//-----------------------------------------------------------------
// Home/Dashboard route
app.get("/home",isLoggedin, wrapAsync(async(req, res)=>{
    // Fetch recommended projects based on user skills
    res.render("main/home.ejs");
}));

// User profile routes
app.get("/users/:id",wrapAsync(async(req,res) => {
    const { id } = req.params;
    // Fetch user profile with projects and skills
    res.render("users/profile.ejs")
}));

app.get("/users/:id/edit",wrapAsync(async(req,res) => {
    res.render("users/profile-edit.ejs")
}));

app.put("/users/:id", wrapAsync(async(req, res) => {
    const { id } = req.params;
    const userData = req.body;
    // Update user profile
    res.redirect(`/users/${id}`);
}));

// Project routes
app.get("/projects/new",wrapAsync(async(req,res) => {
    res.render("main/project-new.ejs")
}));

app.get("/projects",wrapAsync(async(req,res) => {
    // Fetch all projects with filters (tags, status)
    res.render("main/projects.ejs")
}));

app.post("/projects", wrapAsync(async(req, res) => {
    const { title, description, techStack, teamSize, duration, requiredSkills } = req.body;
    // Create new project
    res.redirect("/projects");
}));

app.get("/projects/:id",wrapAsync(async(req,res) => {
    const { id } = req.params;
    // Fetch project details with team members
    res.render("main/project-detail.ejs")
}));

app.get("/projects/:id/edit",wrapAsync(async(req,res) => {
    res.render("main/project-edit.ejs")
}));

app.put("/projects/:id", wrapAsync(async(req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    // Update project
    res.redirect(`/projects/${id}`);
}));

app.delete("/projects/:id", wrapAsync(async(req, res) => {
    const { id } = req.params;
    // Delete project
    res.redirect("/projects");
}));

// Project join/leave routes
app.post("/projects/:id/join", wrapAsync(async(req, res) => {
    const { id } = req.params;
    // Add user to project team
    res.redirect(`/projects/${id}`);
}));

app.delete("/projects/:id/leave", wrapAsync(async(req, res) => {
    const { id } = req.params;
    // Remove user from project team
    res.redirect(`/projects/${id}`);
}));

// Project dashboard (tasks, progress)
app.get("/projects/:id/dashboard",wrapAsync(async(req,res) => {
    const { id } = req.params;
    // Fetch project tasks and analytics
    res.render("main/project-dashboard.ejs")
}));

// Task management routes
app.post("/projects/:id/tasks", wrapAsync(async(req, res) => {
    const { id } = req.params;
    const { title, description, assignedTo, priority, dueDate } = req.body;
    // Create new task
    res.redirect(`/projects/${id}/dashboard`);
}));

app.put("/projects/:id/tasks/:taskId", wrapAsync(async(req, res) => {
    const { id, taskId } = req.params;
    const taskData = req.body;
    // Update task status
    res.redirect(`/projects/${id}/dashboard`);
}));

app.delete("/projects/:id/tasks/:taskId", wrapAsync(async(req, res) => {
    const { id, taskId } = req.params;
    // Delete task
    res.redirect(`/projects/${id}/dashboard`);
}));

// Team chat routes
app.get("/projects/:id/chat",wrapAsync(async(req,res) => {
    const { id } = req.params;
    // Fetch chat messages
    res.render("main/project-chat.ejs")
}));

app.post("/projects/:id/chat", wrapAsync(async(req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    // Save chat message
    res.json({ success: true, message });
}));

// Search and filter routes
app.get("/search", wrapAsync(async(req, res) => {
    const { query, filter } = req.query;
    // Search projects or users
    res.render("main/search.ejs");
}));

// Notification routes
app.get("/notifications", wrapAsync(async(req, res) => {
    // Fetch user notifications
    res.render("main/notifications.ejs");
}));

app.put("/notifications/:id/read", wrapAsync(async(req, res) => {
    const { id } = req.params;
    // Mark notification as read
    res.json({ success: true });
}));

//--------error handling-------------------------------------------------------------
app.use((req,res,next)=>{
next(new ExpressError(404,"page not found"))
})

app.use((err,req,res,next)=>{
let {statusCode=500,message="something went wrong"}=err;
 res.status(statusCode).render("main/404.ejs");
// res.status(statusCode).send(message);
})

//---------------------------------------------------------------------------
app.listen(5000,()=>{
    console.log("listening on port 5000");
})

