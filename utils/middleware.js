const Notification = require("../models/notification.js");

module.exports.isLoggedin=(req,res,next)=>{
    if (!req.isAuthenticated()) {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to access this page!")
       return res.redirect("/login")
    }
    next()
}
module.exports.saveredirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

// Add unread notification count to all views
module.exports.addNotificationCount = async (req, res, next) => {
    if (req.isAuthenticated()) {
        try {
            const unreadCount = await Notification.getUnreadCount(req.user._id);
            res.locals.unreadNotificationCount = unreadCount;
        } catch (error) {
            console.error("Error fetching notification count:", error);
            res.locals.unreadNotificationCount = 0;
        }
    } else {
        res.locals.unreadNotificationCount = 0;
    }
    next();
};
