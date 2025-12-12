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

module.exports = mongoose.model("Project", projectSchema);