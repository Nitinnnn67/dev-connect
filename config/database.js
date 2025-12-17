const mongoose = require('mongoose');

const connectDB = async () => {
      try {
        const dbUrl = process.env.MONGO_DB_ATLAS;
        await mongoose.connect(dbUrl);
        console.log("MongoDB connected successfully");
        console.log("connected to database: Dev-Connect");
        
        // Initialize database with test project
        const Project = require("../models/project.js");
        const count = await Project.countDocuments();
        
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
            await testProject.save();
            console.log("Test project created");
        }
    } catch (error) {
        console.log("MongoDB connection failed:", error);
        process.exit(1);
    }
};

module.exports = connectDB;