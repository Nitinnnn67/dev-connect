const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin } = require("../utils/middleware.js");
const User = require("../models/user.js");
const Project = require("../models/project.js");

// ==================== Main Routes ====================

// Landing page
router.get("/", wrapAsync(async(req, res) => {
    res.render("main/landing.ejs", {
        title: "DevConnect - Collaborate on Projects"
    });
}));

// Home/Dashboard
router.get("/home", isLoggedin, wrapAsync(async(req, res) => {
    
    
    // Fetch user's created projects
    const createdProjects = await Project.find({ createdBy: req.user._id });
    
    // Fetch user's joined projects
    const joinedProjects = await Project.find({ 
        members: req.user._id,
        createdBy: { $ne: req.user._id } // Exclude projects they created
    });
    
    // Calculate stats
    const activeProjects = createdProjects.filter(p => p.status === "open" || p.status === "in-progress").length;
    
    // Count unique team members across all projects user is part of
    const allProjects = await Project.find({ members: req.user._id }).populate("members");
    const uniqueMembers = new Set();
    allProjects.forEach(project => {
        project.members.forEach(member => {
            if (!member._id.equals(req.user._id)) {
                uniqueMembers.add(member._id.toString());
            }
        });
    });
    const teamMembers = uniqueMembers.size;
    
    // Count completed tasks
    let completedTasks = 0;
    let totalTasks = 0;
    allProjects.forEach(project => {
        totalTasks += project.tasks.length;
        completedTasks += project.tasks.filter(task => task.status === "completed").length;
    });
    
    // Calculate productivity percentage
    const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Get recent projects (last 5)
    const recentProjects = await Project.find({ members: req.user._id })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("createdBy", "name username");
    
    res.render("main/home.ejs", {
        title: "Home - DevConnect",
        stats: {
            activeProjects,
            teamMembers,
            completedTasks,
            productivity
        },
        recentProjects
    });
}));
// ==================== User Profile Routes ====================

// View current user's profile (shortcut)
router.get("/users/profile", isLoggedin, wrapAsync(async(req, res) => {
    res.redirect(`/users/${req.user._id}`);
}));

// View user profile
router.get("/users/:id", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    
    const user = await User.findById(id)
        .populate("projectsCreated")
        .populate("projectsJoined");
    
    if (!user) {
        req.flash("error", "User not found!");
        return res.redirect("/home");
    }
    
    const Project = require("../models/project.js");
    
    // Get all projects (created + joined)
    const allProjects = await Project.find({ members: user._id })
        .populate("createdBy", "name username")
        .populate("members", "name username");
    
    // Calculate stats
    const projectCount = allProjects.length;
    
    // Count contributions (tasks assigned to this user)
    let contributions = 0;
    allProjects.forEach(project => {
        contributions += project.tasks.filter(task => 
            task.assignedTo && task.assignedTo.equals(user._id)
        ).length;
    });
    
    res.render("users/profile.ejs", {
        title: `${user.name || user.username} - DevConnect`,
        user,
        projects: allProjects,
        stats: {
            projectCount,
            contributions
        }
    });
}));

// Edit profile form
router.get("/users/:id/edit", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    
    // Verify user is editing their own profile
    if (!req.user._id.equals(id)) {
        req.flash("error", "You can only edit your own profile!");
        return res.redirect(`/users/${id}`);
    }
    
    const user = await User.findById(id);
    
    if (!user) {
        req.flash("error", "User not found!");
        return res.redirect("/home");
    }
    
    res.render("users/profile-edit.ejs", {
        title: "Edit Profile - DevConnect",
        user,
        userId: user._id
    });
}));

// Update profile
router.put("/users/:id", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    
    // Verify user is editing their own profile
    if (!req.user._id.equals(id)) {
        req.flash("error", "You can only edit your own profile!");
        return res.redirect(`/users/${id}`);
    }
    
    console.log("Received form data:", req.body);
    
    const { 
        fullName, 
        bio, 
        skills, 
        location, 
        website, 
        phone, 
        company,
        github, 
        linkedin, 
        twitter, 
        portfolio,
        profilePublic,
        showEmail
    } = req.body;
    
    // Parse skills if it's a string
    let skillsArray = skills;
    if (typeof skills === 'string') {
        skillsArray = skills.split(',').map(s => s.trim()).filter(s => s);
    }
    
    const updateData = {
        name: fullName,
        bio,
        skills: skillsArray,
        location,
        website,
        phone,
        company,
        github,
        linkedin,
        twitter,
        portfolio,
        profilePublic: profilePublic === 'on',
        showEmail: showEmail === 'on'
    };
    
    console.log("Updating with data:", updateData);
    
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    
    console.log("Updated user:", updatedUser);
    
    req.flash("success", "Profile updated successfully!");
    res.redirect(`/users/${id}`);
}));

// ==================== Search ====================

// Search projects and users
router.get("/search", isLoggedin, wrapAsync(async(req, res) => {
    const { query, filter } = req.query;
    
    let projects = [];
    let users = [];
    let resultsCount = 0;
    
    if (query && query.trim().length > 0) {
        const searchQuery = query.trim();
        const searchRegex = new RegExp(searchQuery, 'i');
        
        // Search projects if filter is 'all' or 'projects'
        if (!filter || filter === 'all' || filter === 'projects') {
            projects = await Project.find({
                $or: [
                    { title: searchRegex },
                    { description: searchRegex },
                    { techStack: { $in: [searchRegex] } },
                    { requiredSkills: { $in: [searchRegex] } }
                ]
            })
            .populate('createdBy', 'name username')
            .populate('members', 'name username')
            .sort({ createdAt: -1 })
            .limit(50);
        }
        
        // Search users if filter is 'all' or 'users'
        if (!filter || filter === 'all' || filter === 'users') {
            users = await User.find({
                $or: [
                    { name: searchRegex },
                    { username: searchRegex },
                    { bio: searchRegex },
                    { skills: { $in: [searchRegex] } },
                    { location: searchRegex }
                ]
            })
            .sort({ createdAt: -1 })
            .limit(50);
        }
        
        resultsCount = projects.length + users.length;
    }
    
    res.render("main/search.ejs", {
        title: "Search - DevConnect",
        query: query || '',
        filter: filter || 'all',
        projects,
        users,
        resultsCount
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
    const user = await User.findById(req.user._id);
    
    if (!user) {
        req.flash("error", "User not found!");
        return res.redirect("/home");
    }
    
    res.render("main/settings.ejs", {
        title: "Settings - DevConnect",
        user
    });
}));

// Update password
router.post("/settings/password", isLoggedin, wrapAsync(async(req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        req.flash("error", "All password fields are required!");
        return res.redirect("/settings");
    }
    
    if (newPassword !== confirmPassword) {
        req.flash("error", "New passwords do not match!");
        return res.redirect("/settings");
    }
    
    if (newPassword.length < 6) {
        req.flash("error", "Password must be at least 6 characters long!");
        return res.redirect("/settings");
    }
    
    const user = await User.findById(req.user._id);
    
    try {
        await user.changePassword(currentPassword, newPassword);
        req.flash("success", "Password updated successfully!");
    } catch (error) {
        req.flash("error", "Current password is incorrect!");
    }
    
    res.redirect("/settings");
}));

// Delete account
router.delete("/settings/account", isLoggedin, wrapAsync(async(req, res) => {
    const userId = req.user._id;
    
    // Delete all projects created by user
    await Project.deleteMany({ createdBy: userId });
    
    // Remove user from all projects they're member of
    await Project.updateMany(
        { members: userId },
        { $pull: { members: userId } }
    );
    
    // Delete user account
    await User.findByIdAndDelete(userId);
    
    req.logout((err) => {
        if (err) {
            console.error("Logout error:", err);
        }
        req.flash("success", "Your account has been deleted successfully.");
        res.redirect("/");
    });
}));

module.exports = router;
