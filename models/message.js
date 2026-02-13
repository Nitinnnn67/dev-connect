const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({  
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",    
        required: true,
        index: true
    },
    projectID: {
        type: Schema.Types.ObjectId,            
        ref: "Project",
        required: true,
        index: true
    },
    content: {
        type: String,
        required: true
    },  
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index for efficient querying
messageSchema.index({ projectID: 1, timestamp: 1 });

module.exports = mongoose.model("Message", messageSchema);   
