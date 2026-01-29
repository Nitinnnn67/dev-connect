const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: [
            "join_request",
            "join_request_approved",
            "join_request_rejected",
            "invitation",
            "invitation_accepted",
            "invitation_declined",
            "member_joined",
            "member_left",
            "project_update",
            "task_assigned",
            "message"
        ],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    actionUrl: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Index for faster queries
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

// Method to mark as read
notificationSchema.methods.markAsRead = async function() {
    this.isRead = true;
    return await this.save();
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function(userId) {
    return await this.countDocuments({ user: userId, isRead: false });
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = async function(userId) {
    return await this.updateMany(
        { user: userId, isRead: false },
        { $set: { isRead: true } }
    );
};

module.exports = mongoose.model("Notification", notificationSchema);
