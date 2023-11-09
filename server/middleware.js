"use strict";

function requireLogin(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
}

function requireLogout(req, res, next) {
    if (req.session.loggedIn) {
        res.redirect('/index');
    } else {
        next();
    }
}

module.exports = {
    requireLogin,
    requireLogout
};