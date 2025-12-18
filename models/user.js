const mongoose = require("mongoose");
const schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    skills: [{
        type: String
    }],
    location: {
        type: String,
        default: ""
    },
    website: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    company: {
        type: String,
        default: ""
    },
    github: {
        type: String,
        default: ""
    },
    linkedin: {
        type: String,
        default: ""
    },
    twitter: {
        type: String,
        default: ""
    },
    portfolio: {
        type: String,
        default: ""
    },
    profilePicture: {
        type: String,
        default: ""
    },
    profilePublic: {
        type: Boolean,
        default: true
    },
    showEmail: {
        type: Boolean,
        default: true
    },
    projectsCreated: [{
        type: schema.Types.ObjectId,
        ref: "Project"
    }],
    projectsJoined: [{
        type: schema.Types.ObjectId,
        ref: "Project"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);