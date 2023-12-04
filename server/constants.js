"use strict";
const nodemailer = require("nodemailer");

const connectionParams = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "sa",
    password: process.env.DB_PASSWORD || "secret",
    database: process.env.DB_NAME || "CityofVan",
    port: process.env.DB_PORT || 3307
};

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'scunge352@gmail.com',
        pass: "placeholder"
    }
});

module.exports = {
    connectionParams,
    transporter
};