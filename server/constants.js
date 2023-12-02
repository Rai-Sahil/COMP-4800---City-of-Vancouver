"use strict";

const connectionParams = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "secret",
    database: process.env.DB_NAME || "CityofVan",
    port: process.env.DB_PORT || 3333
};

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'scunge352@gmail.com',
        pass: process.env.GMAIL_ACCOUNT_PASSWORD
    }
});

module.exports = {
    connectionParams,
    transporter
};