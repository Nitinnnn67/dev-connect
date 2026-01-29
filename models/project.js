const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requiredSkills: [{
        type: String
    }],
    techStack: [{
        type: String
    }],
    // Tags and categories for filtering
    tags: [{
        type: String
    }],
    category: {
        type: String,
        enum: ["web", "mobile", "desktop", "ai-ml", "blockchain", "game", "iot", "other"],
        default: "other"
    },
    teamSize: {
        type: Number
    },
    duration: {
        type: String
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    // Join request approval system
    joinRequests: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        message: String,
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },
        requestedAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Project invitation system
    invitations: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        invitedBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        message: String,
        status: {
            type: String,
            enum: ["pending", "accepted", "declined"],
            default: "pending"
        },
        invitedAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Analytics
    analytics: {
        views: {
            type: Number,
            default: 0
        },
        uniqueViewers: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        popularity: {
            type: Number,
            default: 0
        }
    },
    status: {
        type: String,
        enum: ["open", "in-progress", "completed", "closed"],
        default: "open"
    },
    tasks: [{
        title: String,
        description: String,
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        status: {
            type: String,
            enum: ["todo", "in-progress", "completed"],
            default: "todo"
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium"
        },
        dueDate: Date
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Method to calculate popularity score
projectSchema.methods.calculatePopularity = function() {
    const viewScore = this.analytics.views * 0.5;
    const memberScore = this.members.length * 10;
    const uniqueViewerScore = this.analytics.uniqueViewers.length * 2;
    const recencyScore = Math.max(0, 100 - ((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24))); // Decreases over days
    
    this.analytics.popularity = viewScore + memberScore + uniqueViewerScore + recencyScore;
    return this.analytics.popularity;
};

module.exports = mongoose.model("Project", projectSchema);