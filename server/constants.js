"use strict";

const connectionParams = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "sa",
    password: process.env.DB_PASSWORD || "secret",
    database: process.env.DB_NAME || "CityofVan",
    port: process.env.DB_PORT || "3306"
};

module.exports = {
    connectionParams
};