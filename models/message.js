const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({  
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",    
        required: true
    },
    projectID: {
        type: Schema.Types.ObjectId,            
        ref: "Project",
        required: true
    },
    content: {
        type: String,
        required: true
    },  
    timestamp: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model("Message", messageSchema);
                // Send message to server   
