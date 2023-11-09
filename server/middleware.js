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

function checkForFormSubmission(req, res, next) {
    if (req.query && req.query.formSubmitted === 'true') {
        next();
    } else {
        res.redirect('/userform');
    }
}

module.exports = {
    requireLogin,
    requireLogout,
    checkForFormSubmission
};