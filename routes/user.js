/**
 * User Routes Module
 * Handles all user authentication and account management routes
 * @module routes/user
 */

const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveredirectUrl, isLoggedin } = require("../utils/middleware.js");

// ==================== Helper Functions ====================

/**
 * Custom authentication middleware with detailed error handling
 * Provides user-friendly messages for different authentication failure scenarios
 */
const customAuthenticate = async (req, res, next) => {
    let { username, password } = req.body;
    
    // Validate input fields
    if (!username || !password) {
        req.flash("error", "Please provide both email/username and password.");
        return res.redirect("/login");
    }
    
    // Check if input is email, if so, find username
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(username)) {
        try {
            const userByEmail = await User.findOne({ email: username.toLowerCase() });
            if (userByEmail) {
                username = userByEmail.username;
            }
        } catch (error) {
            console.error("Email lookup error:", error);
        }
    }
    
    // Update req.body with the resolved username
    req.body.username = username;
    
    // Authenticate using Passport Local Strategy
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error("Authentication error:", err);
            req.flash("error", "An error occurred during login. Please try again.");
            return res.redirect("/login");
        }
        
        if (!user) {
            // Check if username exists to provide specific feedback
            return User.findOne({ username })
                .then(existingUser => {
                    if (!existingUser) {
                        req.flash("error", "Username not found. Please check your username or register for a new account.");
                    } else {
                        req.flash("error", "Incorrect password. Please try again.");
                    }
                    return res.redirect("/login");
                })
                .catch((error) => {
                    console.error("User lookup error:", error);
                    req.flash("error", "Invalid username or password. Please try again.");
                    return res.redirect("/login");
                });
        }
        
        // Login successful - establish session
        req.logIn(user, (err) => {
            if (err) {
                console.error("Login session error:", err);
                req.flash("error", "Login failed. Please try again.");
                return res.redirect("/login");
            }
            
            req.flash("success", `Welcome back, ${user.name || user.username}!`);
            const redirectUrl = res.locals.redirectUrl || "/home";
            return res.redirect(redirectUrl);
        });
    })(req, res, next);
};

/**
 * Validates registration input data
 * @param {Object} data - User registration data
 * @returns {Object} - Validation result with success boolean and message
 */
const validateRegistrationInput = (data) => {
    const { username, email, password } = data;
    
    if (!username || username.trim().length === 0) {
        return { success: false, message: "Username is required." };
    }
    
    if (username.length < 3) {
        return { success: false, message: "Username must be at least 3 characters long." };
    }
    
    if (!email || email.trim().length === 0) {
        return { success: false, message: "Email is required." };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { success: false, message: "Please provide a valid email address." };
    }
    
    if (!password || password.length < 6) {
        return { success: false, message: "Password must be at least 6 characters long." };
    }
    
    return { success: true };
};

// ==================== Routes ====================

/**
 * GET /register
 * Display registration form
 */
router.get("/register", (req, res) => {
    res.render("users/register.ejs", {
        title: "Register - DevConnect"
    });
});

/**
 * POST /register
 * Process user registration
 * Creates new user account and automatically logs them in
 */
router.post("/register", wrapAsync(async (req, res) => {
    try {
        const { username, email, password, name } = req.body;
        
        // Validate input
        const validation = validateRegistrationInput({ username, email, password });
        if (!validation.success) {
            req.flash("error", validation.message);
            return res.redirect("/register");
        }
        
        // Check if username already exists
        const existingUser = await User.findOne({ username: username.trim() });
        if (existingUser) {
            req.flash("error", "Username already exists. Please choose a different username.");
            return res.redirect("/register");
        }
        
        // Check if email already exists
        const existingEmail = await User.findOne({ email: email.trim().toLowerCase() });
        if (existingEmail) {
            req.flash("error", "Email already registered. Please use a different email or try logging in.");
            return res.redirect("/register");
        }
        
        // Create new user
        const newUser = new User({
            username: username.trim(),
            email: email.trim().toLowerCase(),
            name: name ? name.trim() : username.trim()
        });
        
        const registeredUser = await User.register(newUser, password);
        console.log(`New user registered: ${registeredUser.username}`);
        
        // Auto-login after successful registration
        req.login(registeredUser, (err) => {
            if (err) {
                console.error("Auto-login error:", err);
                req.flash("success", "Registration successful! Please login to continue.");
                return res.redirect("/login");
            }
            req.flash("success", `Welcome to DevConnect, ${registeredUser.name}!`);
            res.redirect("/home");
        });
        
    } catch (error) {
        console.error("Registration error:", error);
        
        let errorMessage = "Registration failed. Please try again.";
        
        // Handle specific Mongoose validation errors
        if (error.name === "UserExistsError") {
            errorMessage = "Username already exists. Please choose a different username.";
        } else if (error.message.includes("validation failed")) {
            errorMessage = "Invalid user data. Please check your information.";
        } else if (error.message.includes("shorter than the minimum")) {
            errorMessage = "Password is too short. Please use at least 6 characters.";
        }
        
        req.flash("error", errorMessage);
        res.redirect("/register");
    }
}));

/**
 * GET /login
 * Display login form
 */
router.get("/login", (req, res) => {
    res.render("users/login.ejs", {
        title: "Login - DevConnect"
    });
});

/*
  POST /login
  Process user login with custom authentication
 */
router.post("/login", saveredirectUrl, customAuthenticate);

/**
 * GET /logout
 * Log out current user and destroy session
 */
router.get("/logout", (req, res, next) => {
    const username = req.user ? req.user.username : "User";
    
    req.logout((err) => {
        if (err) {
            console.error("Logout error:", err);
            return next(err);
        }
        req.flash("success", `Goodbye, ${username}! You have been logged out successfully.`);
        res.redirect("/");
    });
});

module.exports = router;