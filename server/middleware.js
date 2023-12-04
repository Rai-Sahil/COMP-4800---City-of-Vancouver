"use strict";
const { transporter } = require("./constants");
const moment = require("moment");

function requireLogin(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
}

function requireLogout(req, res, next) {
    if (req.session.loggedIn) {
        res.redirect('/');
    } else {
        next();
    }
}

async function sendEmail(email) {
    const mailOptions = {
        from: 'scunge352@gmail.com',
        to: 'raisahil580@gmail.com',
        subject: 'Password Reset',
        text: 'Follow this link to reset your password: https://yourapp.com/reset-password?token=generatedToken'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

async function sendReminderEmail(email, expiryDate) {
    const today = moment();
    const expiryMoment = moment(expiryDate);
    const remainingDays = expiryMoment.diff(today, 'days');
    if (remainingDays < 2) {
        const mailOptions = {
            from: 'scunge352@gmail.com',
            to: artistEmail,
            subject: 'Application Expiry Reminder',
            text: `Your application will expire in 30 days. Please renew it.`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}

module.exports = {
    requireLogin,
    requireLogout,
    sendEmail,
    sendReminderEmail
};