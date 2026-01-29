const Notification = require("../models/notification");

// Create a notification
async function createNotification({ userId, type, title, message, projectId = null, senderId = null, actionUrl = null }) {
    try {
        const notification = new Notification({
            user: userId,
            type,
            title,
            message,
            project: projectId,
            sender: senderId,
            actionUrl
        });
        
        await notification.save();
        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        return null;
    }
}

// Create multiple notifications (for notifying all project members)
async function createBulkNotifications(notificationDataArray) {
    try {
        const notifications = notificationDataArray.map(data => ({
            user: data.userId,
            type: data.type,
            title: data.title,
            message: data.message,
            project: data.projectId || null,
            sender: data.senderId || null,
            actionUrl: data.actionUrl || null
        }));
        
        await Notification.insertMany(notifications);
        return true;
    } catch (error) {
        console.error("Error creating bulk notifications:", error);
        return false;
    }
}

// Notification templates
const templates = {
    joinRequest: (projectTitle, senderName) => ({
        title: "New Join Request",
        message: `${senderName} wants to join your project "${projectTitle}"`
    }),
    
    joinRequestApproved: (projectTitle) => ({
        title: "Join Request Approved",
        message: `Your request to join "${projectTitle}" has been approved!`
    }),
    
    joinRequestRejected: (projectTitle) => ({
        title: "Join Request Declined",
        message: `Your request to join "${projectTitle}" was declined`
    }),
    
    invitation: (projectTitle, senderName) => ({
        title: "Project Invitation",
        message: `${senderName} invited you to join "${projectTitle}"`
    }),
    
    invitationAccepted: (projectTitle, userName) => ({
        title: "Invitation Accepted",
        message: `${userName} accepted your invitation to "${projectTitle}"`
    }),
    
    invitationDeclined: (projectTitle, userName) => ({
        title: "Invitation Declined",
        message: `${userName} declined your invitation to "${projectTitle}"`
    }),
    
    memberJoined: (projectTitle, userName) => ({
        title: "New Member Joined",
        message: `${userName} joined your project "${projectTitle}"`
    }),
    
    memberLeft: (projectTitle, userName) => ({
        title: "Member Left",
        message: `${userName} left the project "${projectTitle}"`
    })
};

module.exports = {
    createNotification,
    createBulkNotifications,
    templates
};
