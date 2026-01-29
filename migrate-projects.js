// Migration script to add analytics and new fields to existing projects
// Run this once after deploying the new schema

const mongoose = require('mongoose');
require('dotenv').config();
const Project = require('./models/project');

async function migrateProjects() {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_DB_ATLAS || process.env.MONGODB_URL);
        console.log("Connected to database");

        // Find all projects
        const projects = await Project.find({});
        console.log(`Found ${projects.length} projects to migrate`);

        let updated = 0;
        let skipped = 0;

        for (const project of projects) {
            let needsUpdate = false;

            // Initialize analytics if missing
            if (!project.analytics) {
                project.analytics = {
                    views: 0,
                    uniqueViewers: [],
                    popularity: 0
                };
                needsUpdate = true;
            }

            // Initialize category if missing
            if (!project.category) {
                project.category = "other";
                needsUpdate = true;
            }

            // Initialize tags if missing
            if (!project.tags) {
                project.tags = [];
                needsUpdate = true;
            }

            // Initialize joinRequests if missing
            if (!project.joinRequests) {
                project.joinRequests = [];
                needsUpdate = true;
            }

            // Initialize invitations if missing
            if (!project.invitations) {
                project.invitations = [];
                needsUpdate = true;
            }

            if (needsUpdate) {
                // Calculate initial popularity
                project.calculatePopularity();
                await project.save();
                updated++;
                console.log(`✓ Updated: ${project.title}`);
            } else {
                skipped++;
            }
        }

        console.log("\n=== Migration Complete ===");
        console.log(`Updated: ${updated} projects`);
        console.log(`Skipped: ${skipped} projects (already up to date)`);

        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

// Run migration
migrateProjects();
