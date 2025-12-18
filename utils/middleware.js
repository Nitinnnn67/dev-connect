module.exports.isLoggedin=(req,res,next)=>{
    if (!req.isAuthenticated()) {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you are not logged in")
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
