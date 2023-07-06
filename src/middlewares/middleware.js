


module.exports.csrfErrorMiddleware = (err, req, res, next) => {
    if(err){
        res.render('404');
    } else{
        next();
    }
}
module.exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken(); 
    next();
}
module.exports.globalMiddleware = (req, res, next) => {
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;
    next();
}