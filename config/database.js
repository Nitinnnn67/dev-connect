const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const dbUrl = process.env.MONGO_DB_ATLAS;
        
        if (!dbUrl) {
            throw new Error('MONGO_DB_ATLAS environment variable is not defined');
        }
        
        await mongoose.connect(dbUrl);
        console.log("✓ MongoDB connected successfully");
        console.log(`✓ Connected to database: Dev-Connect (${process.env.NODE_ENV || 'development'})`);
        
        // Initialize database with test project only in development
        if (process.env.NODE_ENV !== 'production') {
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
                console.log("✓ Test project created");
            }
        }
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;