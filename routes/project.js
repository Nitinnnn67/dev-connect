const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin } = require("../utils/middleware.js");
const Project = require("../models/project.js");
const User = require("../models/user.js");

// ==================== Project Routes ====================

//------------------------------- Projects Listing ------------------------------//
router.get("/", wrapAsync(async(req, res) => {
    console.log('✓ Projects route hit!');
    
    const projects = await Project.find({})
        .populate("createdBy", "name username")
        .populate("members", "name username")
        .sort({ createdAt: -1 });
    
    console.log(`Found ${projects.length} projects`);
    
    res.render("main/projects.ejs", {
        title: "Browse Projects - DevConnect",
        projects
    });
}));

//------------------------------ New Project Form ------------------------------//
router.get("/new", isLoggedin, wrapAsync(async(req, res) => {
    res.render("main/project-new.ejs", {
        title: "Create New Project - DevConnect"
    });
}));
//------------------------------- Create Project -------------------------------//

router.post("/", isLoggedin, wrapAsync(async(req, res) => {
    const { title, description, techStack, requiredSkills, teamSize, duration, status } = req.body;
    const newProject = new Project({
        title,
        description,
        techStack: Array.isArray(techStack) ? techStack : techStack.split(',').map(s => s.trim()),
        requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : requiredSkills.split(',').map(s => s.trim()),
        teamSize,
        duration,
        status: status || "open",
        createdBy: req.user._id,
        members: [req.user._id]
    });
    
    await newProject.save();
    
    // Add project to user's projectsCreated
    await User.findByIdAndUpdate(req.user._id, {
        $push: { projectsCreated: newProject._id }
    });
    req.flash("success", "Project created successfully!");
    res.redirect("/projects");
}));
//-------------------------------- Project Details ------------------------------//
// Show project details
router.get("/:id", wrapAsync(async(req, res) => {
    const { id } = req.params;
    // TODO: Fetch project by ID from database
    const project = await Project.findById(id)
        .populate("createdBy", "name username email bio skills")
        .populate("members", "name username email skills")
        .populate("tasks.assignedTo", "name username");
    
    if (!project) {
        req.flash("error", "Project not found!");
        return res.redirect("/projects");
    }
    
    res.render("main/project-detail.ejs", {
        title: `${project.title} - DevConnect`,
        project
    });
}));
//-------------------------------- Project Editing ------------------------------// 
// Edit project form
router.get("/:id/edit", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    // TODO: Fetch project and verify ownership
    const project = await Project.findById(id);
    
    if (!project) {
        req.flash("error", "Project not found!");
        return res.redirect("/projects");
    }
    
    // Check if user is the project owner
    if (!project.createdBy.equals(req.user._id)) {
        req.flash("error", "You don't have permission to edit this project!");
        return res.redirect(`/projects/${id}`);
    }
    
    res.render("main/project-edit.ejs", {
        title: "Edit Project - DevConnect",
        project
    });
}));
//------------------------------- Project Updating ------------------------------//
// Update project
router.put("/:id", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    const { title, description, techStack, teamSize, duration, requiredSkills, status } = req.body;
    
    const project = await Project.findById(id);
    
    if (!project) {
        req.flash("error", "Project not found!");
        return res.redirect("/projects");
    }
    
    // Check if user is the project owner
    if (!project.createdBy.equals(req.user._id)) {
        req.flash("error", "You don't have permission to edit this project!");
        return res.redirect(`/projects/${id}`);
    }
    
    await Project.findByIdAndUpdate(id, {
        title,
        description,
        techStack: Array.isArray(techStack) ? techStack : techStack.split(',').map(s => s.trim()),
        requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : requiredSkills.split(',').map(s => s.trim()),
        teamSize,
        duration,
        status
    });
    
    req.flash("success", "Project updated successfully!");
    res.redirect(`/projects/${id}`);
}));
//------------------------------- Project Deletion ------------------------------//
router.delete("/:id", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    
    const project = await Project.findById(id);
    
    if (!project) {
        req.flash("error", "Project not found!");
        return res.redirect("/projects");
    }
    
    // Check if user is the project owner
    if (!project.createdBy.equals(req.user._id)) {
        req.flash("error", "You don't have permission to delete this project!");
        return res.redirect(`/projects/${id}`);
    }
    
    await Project.findByIdAndDelete(id);
    
    // Remove project from user's projectsCreated
    await User.findByIdAndUpdate(req.user._id, {
        $pull: { projectsCreated: id }
    });
    
    req.flash("success", "Project deleted successfully!");
    res.redirect("/projects");
}));

// ==================== Project Membership ====================

// Join project
router.post("/:id/join", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id);
    
    if (!project) {
        req.flash("error", "Project not found!");
        return res.redirect("/projects");
    }
    
    // Check if user is already a member
    if (project.members.includes(req.user._id)) {
        req.flash("error", "You are already a member of this project!");
        return res.redirect(`/projects/${id}`);
    }
    
    // Add user to project members
    await Project.findByIdAndUpdate(id, {
        $push: { members: req.user._id }
    });
    
    // Add project to user's projectsJoined
    await User.findByIdAndUpdate(req.user._id, {
        $push: { projectsJoined: id }
    });
    
    req.flash("success", "You joined the project!");
    res.redirect(`/projects/${id}`);
}));
//------------------------------- Project Leaving ------------------------------//

router.delete("/:id/leave", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
     const project = await Project.findById(id);
    
    if (!project) {
        req.flash("error", "Project not found!");
        return res.redirect("/projects");
    }
    
    // Check if user is the project owner
    if (project.createdBy.equals(req.user._id)) {
        req.flash("error", "Project owner cannot leave the project!");
        return res.redirect(`/projects/${id}`);
    }
    
    // Remove user from project members
    await Project.findByIdAndUpdate(id, {
        $pull: { members: req.user._id }
    });
    
    // Remove project from user's projectsJoined
    await User.findByIdAndUpdate(req.user._id, {
        $pull: { projectsJoined: id }
    });
    
    req.flash("success", "You left the project!");
    res.redirect("/projects");
}));

// ==================== Project Dashboard ====================

// Project dashboard
router.get("/:id/dashboard", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id)
        .populate("createdBy", "name username")
        .populate("members", "name username email skills")
        .populate("tasks.assignedTo", "name username");
    
    if (!project) {
        req.flash("error", "Project not found!");
        return res.redirect("/projects");
    }
    
    // Check if user is a member
    if (!project.members.some(member => member._id.equals(req.user._id))) {
        req.flash("error", "You must be a project member to access the dashboard!");
        return res.redirect(`/projects/${id}`);
    }
    
    // Calculate project progress
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(task => task.status === "completed").length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    res.render("main/project-dashboard.ejs", {
        title: `${project.title} Dashboard - DevConnect`,
        project,
        progress,
        totalTasks,
        completedTasks
    });
}));

// ==================== Task Management ====================

// Create task
router.post("/:id/tasks", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    const { title, description, assignedTo, priority, dueDate } = req.body;
    // TODO: Create task in database
    const project = await Project.findById(id);
    
    if (!project) {
        req.flash("error", "Project not found!");
        return res.redirect("/projects");
    }
    
    // Check if user is a member
    if (!project.members.includes(req.user._id)) {
        req.flash("error", "You must be a project member to create tasks!");
        return res.redirect(`/projects/${id}`);
    }
    
    const newTask = {
        title,
        description,
        assignedTo: assignedTo || null,
        priority: priority || "medium",
        dueDate: dueDate || null,
        status: "todo"
    };
    
    await Project.findByIdAndUpdate(id, {
        $push: { tasks: newTask }
    });
    
    req.flash("success", "Task created successfully!");
    res.redirect(`/projects/${id}/dashboard`);
}));
//------------------------------- Task Updating -------------------------------//

// Update task
router.put("/:id/tasks/:taskId", isLoggedin, wrapAsync(async(req, res) => {
    const { id, taskId } = req.params;
    const { title, description, assignedTo, priority, dueDate, status } = req.body;
    
    const project = await Project.findById(id);
    
    if (!project) {
        req.flash("error", "Project not found!");
        return res.redirect("/projects");
    }
    
    // Check if user is a member
    if (!project.members.includes(req.user._id)) {
        req.flash("error", "You must be a project member to update tasks!");
        return res.redirect(`/projects/${id}`);
    }
    
    await Project.findOneAndUpdate(
        { _id: id, "tasks._id": taskId },
        {
            $set: {
                "tasks.$.title": title,
                "tasks.$.description": description,
                "tasks.$.assignedTo": assignedTo || null,
                "tasks.$.priority": priority,
                "tasks.$.dueDate": dueDate || null,
                "tasks.$.status": status
            }
        }
    );
    req.flash("success", "Task updated successfully!");
    res.redirect(`/projects/${id}/dashboard`);
}));
//------------------------------- Task Deletion -------------------------------//
// Delete task
router.delete("/:id/tasks/:taskId", isLoggedin, wrapAsync(async(req, res) => {
    const { id, taskId } = req.params;
    // TODO: Delete task from database
     const project = await Project.findById(id);
    
    if (!project) {
        req.flash("error", "Project not found!");
        return res.redirect("/projects");
    }
    
    // Check if user is a member
    if (!project.members.includes(req.user._id)) {
        req.flash("error", "You must be a project member to delete tasks!");
        return res.redirect(`/projects/${id}`);
    }
    
    await Project.findByIdAndUpdate(id, {
        $pull: { tasks: { _id: taskId } }
    });
    
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
