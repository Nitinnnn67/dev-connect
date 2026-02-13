const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin } = require("../utils/middleware.js");
const Project = require("../models/project.js");
const User = require("../models/user.js");
const Message = require("../models/message.js");
const { createNotification, createBulkNotifications, templates } = require("../utils/notificationHelper.js");
const { calculateSkillMatch, getRecommendedProjects, getRecommendedUsers, getMatchBadge } = require("../utils/skillMatcher.js");

// ==================== Project Routes ====================

//------------------------------- Projects Listing ------------------------------//
router.get("/", wrapAsync(async(req, res) => {
    console.log('✓ Projects route hit!');
    
    const { category, tag, skill, status, sortBy } = req.query;
    
    let query = {};
    
    // Apply filters if provided
    if (category && category !== "all") {
        query.category = category;
    }
    
    if (tag) {
        query.tags = tag;
    }
    
    if (skill) {
        query.requiredSkills = skill;
    }
    
    if (status && status !== "all") {
        query.status = status;
    }
    
    let sortOptions = { createdAt: -1 }; // Default: newest first
    
    if (sortBy === "popularity") {
        sortOptions = { "analytics.popularity": -1 };
    } else if (sortBy === "views") {
        sortOptions = { "analytics.views": -1 };
    } else if (sortBy === "members") {
        // Sort by array length requires aggregation, but for simplicity we'll sort by creation date
        sortOptions = { createdAt: -1 };
    }
    
    let projects = await Project.find(query)
        .populate("createdBy", "name username")
        .populate("members", "name username")
        .sort(sortOptions);
    
    // Add skill match information if user is logged in
    if (req.user) {
        try {
            const currentUser = await User.findById(req.user._id);
            if (currentUser && currentUser.skills && currentUser.skills.length > 0) {
                projects = projects.map(project => {
                    const matchInfo = calculateSkillMatch(currentUser.skills, project.requiredSkills);
                    const projectData = project._doc || project.toObject() || project;
                    return {
                        ...projectData,
                        matchPercentage: matchInfo.percentage,
                        matchBadge: getMatchBadge(matchInfo.percentage),
                        hasMatch: matchInfo.percentage >= 30
                    };
                });
                
                // Sort by skill match if requested
                if (sortBy === "recommended") {
                    projects.sort((a, b) => b.matchPercentage - a.matchPercentage);
                }
            }
        } catch (error) {
            console.error('Error calculating skill matches:', error);
            // Continue without match information
        }
    }
    
    console.log(`Found ${projects.length} projects`);
    
    // Get unique categories, tags, and skills for filter dropdowns
    const allProjects = await Project.find({});
    const categories = [...new Set(allProjects.map(p => p.category))];
    const allTags = [...new Set(allProjects.flatMap(p => p.tags))];
    const allSkills = [...new Set(allProjects.flatMap(p => p.requiredSkills))];
    
    res.render("main/projects.ejs", {
        title: "Browse Projects - DevConnect",
        projects,
        filters: { category, tag, skill, status, sortBy },
        categories,
        allTags,
        allSkills,
        hasUserSkills: req.user && req.user.skills && req.user.skills.length > 0
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
    const { title, description, techStack, requiredSkills, teamSize, duration, status, category, tags } = req.body;
    const newProject = new Project({
        title,
        description,
        techStack: Array.isArray(techStack) ? techStack : techStack.split(',').map(s => s.trim()),
        requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : requiredSkills.split(',').map(s => s.trim()),
        tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
        category: category || "other",
        teamSize,
        duration,
        status: status || "open",
        createdBy: req.user._id,
        members: [req.user._id],
        analytics: {
            views: 0,
            uniqueViewers: [],
            popularity: 0
        }
    });
    
    await newProject.save();
    
    // Add project to user's projectsCreated
    await User.findByIdAndUpdate(req.user._id, {
        $push: { projectsCreated: newProject._id }
    });
    req.flash("success", "Project created successfully!");
    res.redirect("/projects");
}));

// ==================== User Invitations ====================
// Get user's pending invitations
router.get("/invitations", isLoggedin, wrapAsync(async(req, res) => {
    try {
        const projects = await Project.find({
            "invitations.user": req.user._id,
            "invitations.status": "pending"
        })
        .populate("createdBy", "name username")
        .populate("invitations.user", "name username email")
        .populate("invitations.invitedBy", "name username");
        
        // Filter to get only user's pending invitations
        const invitations = projects.map(project => {
            const invitation = project.invitations.find(
                inv => inv.user && inv.user._id && inv.user._id.toString() === req.user._id.toString() && inv.status === "pending"
            );
            if (!invitation) return null;
            
            return {
                project,
                invitation
            };
        }).filter(item => item !== null && item.invitation);
        
        res.render("main/project-invitations.ejs", {
            title: "Project Invitations - DevConnect",
            invitations
        });
    } catch (error) {
        console.error("Error fetching invitations:", error);
        req.flash("error", "Failed to load invitations");
        res.redirect("/projects");
    }
}));

// ==================== Advanced Search ====================
router.get("/search/advanced", wrapAsync(async(req, res) => {
    const { category, tags, skills, status, sortBy } = req.query;
    
    let query = {};
    
    // Filter by category
    if (category && category !== "all") {
        query.category = category;
    }
    
    // Filter by tags
    if (tags) {
        const tagArray = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
        query.tags = { $in: tagArray };
    }
    
    // Filter by required skills
    if (skills) {
        const skillArray = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
        query.requiredSkills = { $in: skillArray };
    }
    
    // Filter by status
    if (status) {
        query.status = status;
    }
    
    let sortOptions = { createdAt: -1 }; // Default sort by newest
    
    // Sort options
    if (sortBy === "popularity") {
        sortOptions = { "analytics.popularity": -1 };
    } else if (sortBy === "views") {
        sortOptions = { "analytics.views": -1 };
    } else if (sortBy === "members") {
        sortOptions = { "members": -1 };
    }
    
    const projects = await Project.find(query)
        .populate("createdBy", "name username")
        .populate("members", "name username")
        .sort(sortOptions);
    
    res.render("main/projects.ejs", {
        title: "Search Projects - DevConnect",
        projects,
        filters: { category, tags, skills, status, sortBy }
    });
}));

//-------------------------------- Project Details ------------------------------//
// Show project details
router.get("/:id", wrapAsync(async(req, res) => {
    const { id } = req.params;
    
    const project = await Project.findById(id)
        .populate("createdBy", "name username email bio skills")
        .populate("members", "name username email skills")
        .populate("tasks.assignedTo", "name username")
        .populate("joinRequests.user", "name username email skills")
        .populate("invitations.user", "name username");
    
    if (!project) {
        req.flash("error", "Project not found!");
        return res.redirect("/projects");
    }
    
    // Track view if user is logged in
    if (req.user) {
        project.analytics.views += 1;
        
        // Add to unique viewers if not already present
        if (!project.analytics.uniqueViewers.includes(req.user._id)) {
            project.analytics.uniqueViewers.push(req.user._id);
        }
        
        // Recalculate popularity
        project.calculatePopularity();
        
        await project.save();
    }
    
    // Check if current user has pending join request
    let userJoinRequest = null;
    if (req.user) {
        userJoinRequest = project.joinRequests.find(
            r => r.user.equals(req.user._id) && r.status === "pending"
        );
    }
    
    // Check if current user has pending invitation
    let userInvitation = null;
    if (req.user) {
        userInvitation = project.invitations.find(
            inv => inv.user.equals(req.user._id) && inv.status === "pending"
        );
    }
    
    // Calculate skill match for current user
    let skillMatch = null;
    if (req.user) {
        const currentUser = await User.findById(req.user._id);
        if (currentUser && currentUser.skills && currentUser.skills.length > 0) {
            skillMatch = calculateSkillMatch(currentUser.skills, project.requiredSkills);
            skillMatch.badge = getMatchBadge(skillMatch.percentage);
        }
    }
    
    res.render("main/project-detail.ejs", {
        title: `${project.title} - DevConnect`,
        project,
        userJoinRequest,
        userInvitation,
        skillMatch
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
    const { title, description, techStack, teamSize, duration, requiredSkills, status, category, tags } = req.body;
    
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
        tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
        category: category || project.category,
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
    
    // Get recommended users if project has required skills
    let recommendedUsers = [];
    try {
        if (project.requiredSkills && project.requiredSkills.length > 0) {
            const memberIds = project.members.map(m => m._id);
            const availableUsers = await User.find({
                _id: { $nin: [...memberIds, project.createdBy._id] },
                profilePublic: true,
                skills: { $exists: true, $ne: [] }
            }).select("name username profilePicture skills bio").limit(50);
            
            const recommendations = getRecommendedUsers(project, availableUsers, 40);
            recommendedUsers = recommendations.slice(0, 8).map(rec => {
                const userData = rec.user._doc || rec.user.toObject() || rec.user;
                return {
                    ...userData,
                    _id: rec.user._id,
                    matchPercentage: rec.percentage,
                    matchedSkills: rec.matchedSkills,
                    badge: getMatchBadge(rec.percentage)
                };
            });
        }
    } catch (error) {
        console.error('Error fetching recommended users:', error);
        // Continue without recommendations
    }
    
    res.render("main/project-dashboard.ejs", {
        title: `${project.title} Dashboard - DevConnect`,
        project,
        progress,
        totalTasks,
        completedTasks,
        recommendedUsers
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

// ==================== Join Request System ====================

// Submit join request
router.post("/:id/request-join", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    
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
    
    // Check if user already has a pending request
    const existingRequest = project.joinRequests.find(
        req => req.user.equals(req.user._id) && req.status === "pending"
    );
    
    if (existingRequest) {
        req.flash("error", "You already have a pending join request!");
        return res.redirect(`/projects/${id}`);
    }
    
    // Add join request
    await Project.findByIdAndUpdate(id, {
        $push: {
            joinRequests: {
                user: req.user._id,
                message: message || "",
                status: "pending",
                requestedAt: Date.now()
            }
        }
    });
    
    // Send notification to project owner
    const notificationData = templates.joinRequest(project.title, req.user.name || req.user.username);
    await createNotification({
        userId: project.createdBy,
        type: "join_request",
        title: notificationData.title,
        message: notificationData.message,
        projectId: project._id,
        senderId: req.user._id,
        actionUrl: `/projects/${id}/join-requests`
    });
    
    req.flash("success", "Join request submitted! Waiting for approval.");
    res.redirect(`/projects/${id}`);
}));

// View join requests (project owner only)
router.get("/:id/join-requests", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    
    const project = await Project.findById(id)
        .populate("joinRequests.user", "name username email skills bio")
        .populate("createdBy", "name username");
    
    if (!project) {
        req.flash("error", "Project not found!");
        return res.redirect("/projects");
    }
    
    // Check if user is the project owner
    if (!project.createdBy._id.equals(req.user._id)) {
        req.flash("error", "Only the project owner can view join requests!");
        return res.redirect(`/projects/${id}`);
    }
    
    // Filter pending requests
    const pendingRequests = project.joinRequests.filter(req => req.status === "pending");
    
    res.render("main/project-join-requests.ejs", {
        title: `Join Requests - ${project.title}`,
        project,
        joinRequests: pendingRequests
    });
}));

// Approve join request
router.post("/:id/join-requests/:requestId/approve", isLoggedin, wrapAsync(async(req, res) => {
    const { id, requestId } = req.params;
    
    const project = await Project.findById(id);
    
    if (!project) {
        req.flash("error", "Project not found!");
        return res.redirect("/projects");
    }
    
    // Check if user is the project owner
    if (!project.createdBy.equals(req.user._id)) {
        req.flash("error", "Only the project owner can approve requests!");
        return res.redirect(`/projects/${id}`);
    }
    
    // Find the request
    const request = project.joinRequests.id(requestId);
    
    if (!request) {
        req.flash("error", "Request not found!");
        return res.redirect(`/projects/${id}/join-requests`);
    }
    
    // Update request status
    request.status = "approved";
    
    // Add user to members
    if (!project.members.includes(request.user)) {
        project.members.push(request.user);
    }
    
    await project.save();
    
    // Add project to user's projectsJoined
    await User.findByIdAndUpdate(request.user, {
        $addToSet: { projectsJoined: id }
    });
    
    // Notify requester that their request was approved
    const approvalNotification = templates.joinRequestApproved(project.title);
    await createNotification({
        userId: request.user,
        type: "join_request_approved",
        title: approvalNotification.title,
        message: approvalNotification.message,
        projectId: project._id,
        senderId: req.user._id,
        actionUrl: `/projects/${id}`
    });
    
    // Notify all existing members about new member
    const newMember = await User.findById(request.user);
    const memberNotification = templates.memberJoined(project.title, newMember.name || newMember.username);
    const memberNotifications = project.members
        .filter(memberId => !memberId.equals(request.user) && !memberId.equals(project.createdBy))
        .map(memberId => ({
            userId: memberId,
            type: "member_joined",
            title: memberNotification.title,
            message: memberNotification.message,
            projectId: project._id,
            senderId: request.user,
            actionUrl: `/projects/${id}`
        }));
    
    if (memberNotifications.length > 0) {
        await createBulkNotifications(memberNotifications);
    }
    
    // Also notify project owner if they're not the one approving
    if (!project.createdBy.equals(req.user._id)) {
        await createNotification({
            userId: project.createdBy,
            type: "member_joined",
            title: memberNotification.title,
            message: memberNotification.message,
            projectId: project._id,
            senderId: request.user,
            actionUrl: `/projects/${id}`
        });
    }
    
    req.flash("success", "Join request approved!");
    res.redirect(`/projects/${id}/join-requests`);
}));

// Reject join request
router.post("/:id/join-requests/:requestId/reject", isLoggedin, wrapAsync(async(req, res) => {
    const { id, requestId } = req.params;
    
    const project = await Project.findById(id);
    
    if (!project) {
        req.flash("error", "Project not found!");
        return res.redirect("/projects");
    }
    
    // Check if user is the project owner
    if (!project.createdBy.equals(req.user._id)) {
        req.flash("error", "Only the project owner can reject requests!");
        return res.redirect(`/projects/${id}`);
    }
    
    // Find and update the request
    const request = project.joinRequests.id(requestId);
    
    if (!request) {
        req.flash("error", "Request not found!");
        return res.redirect(`/projects/${id}/join-requests`);
    }
    
    request.status = "rejected";
    await project.save();
    
    // Notify requester that their request was rejected
    const rejectionNotification = templates.joinRequestRejected(project.title);
    await createNotification({
        userId: request.user,
        type: "join_request_rejected",
        title: rejectionNotification.title,
        message: rejectionNotification.message,
        projectId: project._id,
        senderId: req.user._id,
        actionUrl: `/projects/${id}`
    });
    
    req.flash("success", "Join request rejected!");
    res.redirect(`/projects/${id}/join-requests`);
}));

// ==================== Project Invitation System ====================

// Send invitation to user
router.post("/:id/invite", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    const { userId, message } = req.body;
    
    try {
        if (!userId) {
            req.flash("error", "User ID or username is required!");
            return res.redirect(`/projects/${id}`);
        }
        
        const project = await Project.findById(id);
        
        if (!project) {
            req.flash("error", "Project not found!");
            return res.redirect("/projects");
        }
        
        // Check if user is the project owner or a member
        if (!project.createdBy.equals(req.user._id) && !project.members.includes(req.user._id)) {
            req.flash("error", "Only project members can send invitations!");
            return res.redirect(`/projects/${id}`);
        }
        
        // Find target user by ID or username
        let targetUser = null;
        
        // Try to find by ID first
        if (userId.match(/^[0-9a-fA-F]{24}$/)) {
            targetUser = await User.findById(userId);
        }
        
        // If not found by ID, try username
        if (!targetUser) {
            targetUser = await User.findOne({ username: userId });
        }
        
        if (!targetUser) {
            req.flash("error", "User not found! Please check the username or user ID.");
            return res.redirect(`/projects/${id}`);
        }
        
        const targetUserId = targetUser._id;
        
        // Check if user is already a member
        if (project.members.some(member => member.equals(targetUserId))) {
            req.flash("error", "User is already a member of this project!");
            return res.redirect(`/projects/${id}`);
        }
        
        // Check if invitation already exists
        const existingInvitation = project.invitations.find(
            inv => inv.user.equals(targetUserId) && inv.status === "pending"
        );
        
        if (existingInvitation) {
            req.flash("error", "User already has a pending invitation!");
            return res.redirect(`/projects/${id}`);
        }
        
        // Add invitation
        await Project.findByIdAndUpdate(id, {
            $push: {
                invitations: {
                    user: targetUserId,
                    invitedBy: req.user._id,
                    message: message || "",
                    status: "pending",
                    invitedAt: Date.now()
                }
            }
        });
        
        // Send notification to invited user
        const invitationNotification = templates.invitation(project.title, req.user.name || req.user.username);
        await createNotification({
            userId: targetUserId,
            type: "invitation",
            title: invitationNotification.title,
            message: invitationNotification.message,
            projectId: project._id,
            senderId: req.user._id,
            actionUrl: `/projects/invitations`
        });
        
        req.flash("success", `Invitation sent successfully to ${targetUser.username}!`);
        res.redirect(`/projects/${id}`);
    } catch (error) {
        console.error("Error sending invitation:", error);
        req.flash("error", "Failed to send invitation. Please try again.");
        res.redirect(`/projects/${id}`);
    }
}));

// View user's project invitations
// Accept invitation
router.post("/:id/invitations/:invitationId/accept", isLoggedin, wrapAsync(async(req, res) => {
    const { id, invitationId } = req.params;
    
    const project = await Project.findById(id);
    
    if (!project) {
        req.flash("error", "Project not found!");
        return res.redirect("/projects");
    }
    
    // Find the invitation
    const invitation = project.invitations.id(invitationId);
    
    if (!invitation) {
        req.flash("error", "Invitation not found!");
        return res.redirect("/projects/invitations");
    }
    
    // Check if invitation is for current user
    if (!invitation.user.equals(req.user._id)) {
        req.flash("error", "This invitation is not for you!");
        return res.redirect("/projects/invitations");
    }
    
    // Update invitation status
    invitation.status = "accepted";
    
    // Add user to members
    if (!project.members.includes(req.user._id)) {
        project.members.push(req.user._id);
    }
    
    await project.save();
    
    // Add project to user's projectsJoined
    await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { projectsJoined: id }
    });
    
    // Notify the person who sent the invitation
    const acceptNotification = templates.invitationAccepted(project.title, req.user.name || req.user.username);
    await createNotification({
        userId: invitation.invitedBy,
        type: "invitation_accepted",
        title: acceptNotification.title,
        message: acceptNotification.message,
        projectId: project._id,
        senderId: req.user._id,
        actionUrl: `/projects/${id}`
    });
    
    // Notify all existing members about new member
    const memberNotification = templates.memberJoined(project.title, req.user.name || req.user.username);
    const memberNotifications = project.members
        .filter(memberId => !memberId.equals(req.user._id) && !memberId.equals(invitation.invitedBy))
        .map(memberId => ({
            userId: memberId,
            type: "member_joined",
            title: memberNotification.title,
            message: memberNotification.message,
            projectId: project._id,
            senderId: req.user._id,
            actionUrl: `/projects/${id}`
        }));
    
    if (memberNotifications.length > 0) {
        await createBulkNotifications(memberNotifications);
    }
    
    req.flash("success", "Invitation accepted! Welcome to the project!");
    res.redirect(`/projects/${id}`);
}));

// Decline invitation
router.post("/:id/invitations/:invitationId/decline", isLoggedin, wrapAsync(async(req, res) => {
    const { id, invitationId } = req.params;
    
    const project = await Project.findById(id);
    
    if (!project) {
        req.flash("error", "Project not found!");
        return res.redirect("/projects");
    }
    
    // Find the invitation
    const invitation = project.invitations.id(invitationId);
    
    if (!invitation) {
        req.flash("error", "Invitation not found!");
        return res.redirect("/projects/invitations");
    }
    
    // Check if invitation is for current user
    if (!invitation.user.equals(req.user._id)) {
        req.flash("error", "This invitation is not for you!");
        return res.redirect("/projects/invitations");
    }
    
    invitation.status = "declined";
    await project.save();
    
    // Notify the person who sent the invitation
    const declineNotification = templates.invitationDeclined(project.title, req.user.name || req.user.username);
    await createNotification({
        userId: invitation.invitedBy,
        type: "invitation_declined",
        title: declineNotification.title,
        message: declineNotification.message,
        projectId: project._id,
        senderId: req.user._id,
        actionUrl: `/projects/${id}`
    });
    
    req.flash("success", "Invitation declined!");
    res.redirect("/projects/invitations");
}));

// ==================== Project Analytics ====================

// Track project view
router.post("/:id/track-view", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    
    const project = await Project.findById(id);
    
    if (!project) {
        return res.status(404).json({ success: false });
    }
    
    // Increment view count
    project.analytics.views += 1;
    
    // Add to unique viewers if not already present
    if (!project.analytics.uniqueViewers.includes(req.user._id)) {
        project.analytics.uniqueViewers.push(req.user._id);
    }
    
    // Recalculate popularity
    project.calculatePopularity();
    
    await project.save();
    
    res.json({ success: true, views: project.analytics.views });
}));

// Get project analytics (owner only)
router.get("/:id/analytics", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    
    const project = await Project.findById(id)
        .populate("createdBy", "name username")
        .populate("analytics.uniqueViewers", "name username");
    
    if (!project) {
        req.flash("error", "Project not found!");
        return res.redirect("/projects");
    }
    
    // Check if user is the project owner
    if (!project.createdBy._id.equals(req.user._id)) {
        req.flash("error", "Only the project owner can view analytics!");
        return res.redirect(`/projects/${id}`);
    }
    
    // Calculate additional metrics
    const memberCount = project.members.length;
    const taskCount = project.tasks.length;
    const completedTasks = project.tasks.filter(t => t.status === "completed").length;
    const completionRate = taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0;
    
    res.render("main/project-analytics.ejs", {
        title: `Analytics - ${project.title}`,
        project,
        analytics: {
            views: project.analytics.views,
            uniqueViewers: project.analytics.uniqueViewers,
            popularity: Math.round(project.analytics.popularity),
            memberCount,
            taskCount,
            completedTasks,
            completionRate
        }
    });
}));

// ==================== Project Filtering & Search ====================

// Advanced project search with filters
// ==================== Project Chat ====================

// Get project chat
router.get("/:id/chat", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    
    // Fetch project with members
    const project = await Project.findById(id)
        .populate("createdBy", "name username email")
        .populate("members", "name username email profilePicture");
    
    if (!project) {
        req.flash("error", "Project not found!");
        return res.redirect("/projects");
    }
    
    // Check if user is a member
    if (!project.members.some(member => member._id.equals(req.user._id))) {
        req.flash("error", "You must be a project member to access the chat!");
        return res.redirect(`/projects/${id}`);
    }
    
    // Fetch recent messages (last 50)
    const messages = await Message.find({ projectID: id })
        .populate("sender", "name username profilePicture")
        .sort({ timestamp: 1 })
        .limit(50);
    
    res.render("main/project-chat.ejs", {
        title: `${project.title} - Team Chat`,
        project,
        messages
    });
}));

// Send chat message
router.post("/:id/chat", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    
    // Validate message
    if (!message || message.trim().length === 0) {
        return res.status(400).json({ success: false, error: "Message cannot be empty" });
    }
    
    // Check if project exists and user is a member
    const project = await Project.findById(id);
    
    if (!project) {
        return res.status(404).json({ success: false, error: "Project not found" });
    }
    
    if (!project.members.includes(req.user._id)) {
        return res.status(403).json({ success: false, error: "You must be a project member to send messages" });
    }
    
    // Create and save message
    const newMessage = new Message({
        sender: req.user._id,
        projectID: id,
        content: message.trim(),
        timestamp: new Date()
    });
    
    try {
        await newMessage.save();
        console.log('✓ Message saved to database:', newMessage._id);
    } catch (saveError) {
        console.error('✗ Error saving message:', saveError);
        return res.status(500).json({ success: false, error: "Failed to save message" });
    }
    
    // Populate sender info
    await newMessage.populate("sender", "name username profilePicture");
    
    // Broadcast to all users in the project room via Socket.io (including sender)
    const io = req.app.get('io');
    if (io) {
        const messageData = {
            _id: newMessage._id.toString(),
            sender: {
                _id: newMessage.sender._id.toString(),
                name: newMessage.sender.name || newMessage.sender.username,
                username: newMessage.sender.username,
                profilePicture: newMessage.sender.profilePicture || null
            },
            content: newMessage.content,
            timestamp: newMessage.timestamp
        };
        
        // Emit to all clients in the room (including sender)
        io.to(id).emit('newMessage', messageData);
        console.log('✓ Message broadcasted to room:', id);
    } else {
        console.error('✗ Socket.io not available');
    }
    
    res.json({ 
        success: true, 
        message: newMessage
    });
}));

//------------------------------- Skill-Based Recommendations ------------------------------//

/**
 * GET /projects/api/recommended
 * Get recommended projects for the logged-in user based on their skills
 */
router.get("/api/recommended", isLoggedin, wrapAsync(async(req, res) => {
    const userId = req.user._id;
    const minMatch = parseInt(req.query.minMatch) || 30;
    const limit = parseInt(req.query.limit) || 10;
    
    // Get user with skills
    const user = await User.findById(userId);
    
    if (!user || !user.skills || user.skills.length === 0) {
        return res.json({
            success: true,
            recommendations: [],
            message: "Add skills to your profile to get personalized recommendations"
        });
    }
    
    // Get all open projects that user is not a member of
    const projects = await Project.find({ 
        status: "open",
        members: { $ne: userId },
        createdBy: { $ne: userId }
    })
    .populate("createdBy", "name username profilePicture")
    .populate("members", "name username");
    
    // Get recommendations
    const recommendations = getRecommendedProjects(user, projects, minMatch);
    
    // Limit results
    const limitedRecommendations = recommendations.slice(0, limit).map(rec => ({
        project: rec.project,
        matchPercentage: rec.percentage,
        matchedSkills: rec.matchedSkills,
        missingSkills: rec.missingSkills,
        relatedSkills: rec.relatedSkills,
        badge: getMatchBadge(rec.percentage)
    }));
    
    res.json({
        success: true,
        recommendations: limitedRecommendations,
        total: recommendations.length
    });
}));

/**
 * GET /projects/:id/api/recommended-users
 * Get recommended users for a project based on required skills
 * Only project owner and members can access
 */
router.get("/:id/api/recommended-users", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    const minMatch = parseInt(req.query.minMatch) || 40;
    const limit = parseInt(req.query.limit) || 20;
    
    // Get project
    const project = await Project.findById(id)
        .populate("createdBy", "name username")
        .populate("members", "_id");
    
    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found"
        });
    }
    
    // Check if user is owner or member
    const userId = req.user._id;
    const isOwner = project.createdBy._id.equals(userId);
    const isMember = project.members.some(member => member._id.equals(userId));
    
    if (!isOwner && !isMember) {
        return res.status(403).json({
            success: false,
            message: "Only project owner and members can view recommended users"
        });
    }
    
    if (!project.requiredSkills || project.requiredSkills.length === 0) {
        return res.json({
            success: true,
            recommendations: [],
            message: "Add required skills to the project to get user recommendations"
        });
    }
    
    // Get all users who are not already members and have public profiles
    const memberIds = project.members.map(m => m._id);
    const users = await User.find({
        _id: { $nin: [...memberIds, project.createdBy._id] },
        profilePublic: true,
        skills: { $exists: true, $ne: [] }
    }).select("name username profilePicture skills bio location");
    
    // Get recommendations
    const recommendations = getRecommendedUsers(project, users, minMatch);
    
    // Limit results
    const limitedRecommendations = recommendations.slice(0, limit).map(rec => ({
        user: rec.user,
        matchPercentage: rec.percentage,
        matchedSkills: rec.matchedSkills,
        missingSkills: rec.missingSkills,
        relatedSkills: rec.relatedSkills,
        badge: getMatchBadge(rec.percentage)
    }));
    
    res.json({
        success: true,
        recommendations: limitedRecommendations,
        total: recommendations.length
    });
}));

/**
 * GET /projects/:id/api/skill-match
 * Calculate skill match between current user and a specific project
 */
router.get("/:id/api/skill-match", isLoggedin, wrapAsync(async(req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    
    // Get project and user
    const [project, user] = await Promise.all([
        Project.findById(id),
        User.findById(userId)
    ]);
    
    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found"
        });
    }
    
    if (!user || !user.skills || user.skills.length === 0) {
        return res.json({
            success: true,
            matchPercentage: 0,
            message: "Add skills to your profile to see match percentage"
        });
    }
    
    // Calculate match
    const matchInfo = calculateSkillMatch(user.skills, project.requiredSkills);
    const badge = getMatchBadge(matchInfo.percentage);
    
    res.json({
        success: true,
        ...matchInfo,
        badge
    });
}));

module.exports = router;
