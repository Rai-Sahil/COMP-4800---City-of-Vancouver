"use strict";

const { connectionParams } = require("./constants");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const fs = require('fs');

const mainConnection = mysql.createConnection(connectionParams);
const connection = mainConnection.promise();

async function authenticate(email, password, callback) {
    try {
        const query = `SELECT * from user where email = ? LIMIT 1;`;
        const [[user]] = await connection.query(query, [email]);
        console.log(user);
        console.log(password);

        if (!user) return callback(null);
        else {
            const passwordsMatch = await bcrypt.compare(password, user.password);
            if (passwordsMatch) {
                const [[appoved]] = await connection.query(`SELECT approved FROM user_application WHERE email = ? LIMIT 1;`, [email]);
                if (appoved.approved === 0) return callback(null);
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

async function updatePassword(email, password) {
    try {

        const saltRounds = 10;
        console.log(email);
        console.log(password);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log(hashedPassword);
        const updatePasswordQuery = `
            UPDATE user SET password = ?
            WHERE email = ?
        `;

        const data = await connection.query(updatePasswordQuery, [hashedPassword, email]);
        console.log(data);
        return true;
    } catch (error) {
        console.error("Error updating password: ", error);
        return false;
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

        const query = `UPDATE user_application SET approved = 1, approvedDate = ? WHERE email = ?`;
        await connection.query(query, [new Date().toISOString().slice(0, 19).replace('T', ' '), email], (err, result) => {
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

async function removeUserApplication(email, callback) {
    try {
        const query = `DELETE FROM user_application WHERE email = ?`;
        await connection.query(query, [email], (err, result) => {
            if (err) console.log('Error removing user application: ', err);
            else
            {
                return callback(result);
            }
             
        });
    } catch (error) {
        console.log("Error something went wrong: ", error);
    }
}



module.exports = {
    authenticate,
    createUser,
    updatePassword,
    mainConnection,
    giveAdminUserApplication,
    approveUserApplication,
    getApprovedUser,
    removeUserApplication
};