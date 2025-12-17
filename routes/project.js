const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin } = require("../utils/middleware.js");
const Project = require("../models/project.js");

// ==================== Project Routes ====================

// New project form
router.get("/new", isLoggedin, wrapAsync(async(req, res) => {
    res.render("main/project-new.ejs", {
        title: "Create New Project - DevConnect"
    });
}));

// All projects listing
router.get("/", wrapAsync(async(req, res) => {
    // TODO: Fetch all projects from database
    res.render("main/projects.ejs", {
        title: "Browse Projects - DevConnect"
    });
}));

// Create new project
router.post("/", isLoggedin, wrapAsync(async(req, res) => {
    const { title, description, techStack, teamSize, duration, requiredSkills } = req.body;
    // TODO: Create new project in database
    req.flash("success", "Project created successfully!");
    res.redirect("/projects");
}));

// Show project details
router.get("/:id", wrapAsync(async(req, res) => {
    const { id } = req.params;
    // TODO: Fetch project by ID from database
    res.render("main/project-detail.ejs", {
        title: "Project Details - DevConnect"
    });
}));

// Edit project form
router.get("/:id/edit", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    // TODO: Fetch project and verify ownership
    res.render("main/project-edit.ejs", {
        title: "Edit Project - DevConnect"
    });
}));

// Update project
router.put("/:id", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    // TODO: Update project in database
    req.flash("success", "Project updated successfully!");
    res.redirect(`/projects/${id}`);
}));

// Delete project
router.delete("/:id", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    // TODO: Delete project from database
    req.flash("success", "Project deleted successfully!");
    res.redirect("/projects");
}));

// ==================== Project Membership ====================

// Join project
router.post("/:id/join", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    // TODO: Add user to project members
    req.flash("success", "You joined the project!");
    res.redirect(`/projects/${id}`);
}));

// Leave project
router.delete("/:id/leave", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    // TODO: Remove user from project members
    req.flash("success", "You left the project!");
    res.redirect(`/projects/${id}`);
}));

// ==================== Project Dashboard ====================

// Project dashboard
router.get("/:id/dashboard", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    // TODO: Fetch project with tasks and progress
    res.render("main/project-dashboard.ejs", {
        title: "Project Dashboard - DevConnect"
    });
}));

// ==================== Task Management ====================

// Create task
router.post("/:id/tasks", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    const { title, description, assignedTo, priority, dueDate } = req.body;
    // TODO: Create task in database
    req.flash("success", "Task created successfully!");
    res.redirect(`/projects/${id}/dashboard`);
}));

// Update task
router.put("/:id/tasks/:taskId", isLoggedin, wrapAsync(async(req, res) => {
    const { id, taskId } = req.params;
    const updateData = req.body;
    // TODO: Update task in database
    req.flash("success", "Task updated successfully!");
    res.redirect(`/projects/${id}/dashboard`);
}));

// Delete task
router.delete("/:id/tasks/:taskId", isLoggedin, wrapAsync(async(req, res) => {
    const { id, taskId } = req.params;
    // TODO: Delete task from database
    req.flash("success", "Task deleted successfully!");
    res.redirect(`/projects/${id}/dashboard`);
}));

// ==================== Project Chat ====================

// Get project chat
router.get("/:id/chat", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    // TODO: Fetch chat messages for project
    res.render("main/project-chat.ejs", {
        title: "Project Chat - DevConnect"
    });
}));

// Send chat message
router.post("/:id/chat", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    // TODO: Save message to database and broadcast via Socket.io
    res.json({ success: true, message });
}));

module.exports = router;
