"use strict";

const { connectionParams } = require("./constants");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");

const mainConnection = mysql.createConnection(connectionParams);
const connection = mainConnection.promise();

async function authenticate(email, password, callback) {
    try {
        const query = `SELECT uuid, name, email, password, admin FROM user WHERE email = ? LIMIT 1;`;
        const [[user]] = await connection.query(query, [email]);

        if (!user) return callback(null);
        else {
            const passwordsMatch = await bcrypt.compare(password, user.password);
            if (passwordsMatch) {
                return callback({
                    name: user.name,
                    email: user.email,
                    uuid: user.uuid,
                    admin: user.admin
                });
            } else return callback(null);
        }
    } catch (error) {
        console.log("Error authenticating the user: ", error);
    }
}

async function isEmailInUse(email) {
    try {
        const query = `SELECT * FROM user WHERE email = ?`;
        const result = await connection.query(query, [email])
        
        if (result[0].length > 0) return true;
        else return false;
    } catch (err) {
        console.log("Error something went wrong: ", err)
    }
}

async function createUser(user, callback) {
    try {
        const { email, password, name } = user;

        if (await isEmailInUse(email)) {
            return callback({ status: 409, message: "Email already in use." });
        }

        const saltRounds = 10;
        
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const insertUserQuery = `
            INSERT INTO user (email, password, name)
            VALUES (?, ?, ?)
        `;

        await connection.query(insertUserQuery, [email, hashedPassword, name]);

        const getUserByEmailQuery = `SELECT * FROM user WHERE email = ? LIMIT 1;`;
        const [[newUser]] = await connection.query(getUserByEmailQuery, [email]);
        return callback({
            status: 200,
            message: "User successfully created.",
            user: newUser,
        });
    } catch (error) {
        console.error("Error creating user: ", error);
        return callback({ status: 500, message: "Internal server error." });
    }
}

async function giveAdminUserApplication(callback) {
    try {
        const query = `SELECT * FROM user_application where approved = 0`;
        const data = await connection.query(query);
        return callback(data);
    } catch (error) {
        console.log("Error something went wrong: ", error);
    }
}

async function approveUserApplication(email, callback) {
    try {
        const query = `UPDATE user_application SET approved = 1 WHERE email = ?`;
        await connection.query(query, [email], (err, result) => {
            if (err) console.log('Error approving user application: ', err);
            else return callback(result);
        });
    } catch (error) {
        console.log("Error something went wrong: ", error);
    }
}

async function getApprovedUser(callback) {
    try {
        const query = `SELECT * FROM user_application WHERE approved = 1`;
        const data = await connection.query(query);
        return callback(data);
    } catch (error) {
        console.log("Error something went wrong: ", error);
    }
}

module.exports = {
    authenticate,
    createUser,
    mainConnection,
    giveAdminUserApplication,
    approveUserApplication,
    getApprovedUser
};