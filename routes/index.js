const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin } = require("../utils/middleware.js");
const User = require("../models/user.js");

// ==================== Main Routes ====================

// Landing page
router.get("/", wrapAsync(async(req, res) => {
    res.render("main/landing.ejs", {
        title: "DevConnect - Collaborate on Projects"
    });
}));

// Home/Dashboard
router.get("/home", isLoggedin, wrapAsync(async(req, res) => {
    // TODO: Fetch user's projects and recommendations
    res.render("main/home.ejs", {
        title: "Home - DevConnect"
    });
}));

// ==================== User Profile Routes ====================

// View user profile
router.get("/users/:id", wrapAsync(async(req, res) => {
    const { id } = req.params;
    // TODO: Fetch user data by ID
    res.render("users/profile.ejs", {
        title: "User Profile - DevConnect"
    });
}));

// Edit profile form
router.get("/users/:id/edit", isLoggedin, wrapAsync(async(req, res) => {
    // TODO: Verify user is editing their own profile
    res.render("users/profile-edit.ejs", {
        title: "Edit Profile - DevConnect"
    });
}));

// Update profile
router.put("/users/:id", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    const { name, bio, skills, github, linkedin, availability } = req.body;
    // TODO: Update user profile in database
    req.flash("success", "Profile updated successfully!");
    res.redirect(`/users/${id}`);
}));

// ==================== Search ====================

// Search projects and users
router.get("/search", wrapAsync(async(req, res) => {
    const { query, filter } = req.query;
    // TODO: Implement search with MongoDB queries
    res.render("main/search.ejs", {
        title: "Search - DevConnect"
    });
}));

// ==================== Notifications ====================

// Get all notifications
router.get("/notifications", isLoggedin, wrapAsync(async(req, res) => {
    // TODO: Fetch user notifications from database
    res.render("main/notifications.ejs", {
        title: "Notifications - DevConnect"
    });
}));

// Mark notification as read
router.put("/notifications/:id/read", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    // TODO: Update notification status
    res.json({ success: true });
}));

// ==================== Settings ====================

// Settings page
router.get("/settings", isLoggedin, wrapAsync(async(req, res) => {
    res.render("main/settings.ejs", {
        title: "Settings - DevConnect"
    });
}));

module.exports = router;
