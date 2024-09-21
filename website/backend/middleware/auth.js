// backend/middleware/auth.js
function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/login.html');
}

module.exports = { ensureAuthenticated };
