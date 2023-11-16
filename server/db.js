"use strict";

const { connectionParams } = require("./constants");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");

const connection = mysql.createConnection(connectionParams).promise();

async function authenticate(email, password, callback) {
    try {
        const query = `SELECT uuid, name, email, password FROM user WHERE email = ? LIMIT 1;`;
        const [[user]] = await connection.query(query, [email]);

        if (!user) return callback(null);
        else {
            const passwordsMatch = await bcrypt.compare(password, user.password);
            if (passwordsMatch) {
                return callback({
                    name: user.name,
                    email: user.email,
                    uuid: user.uuid,
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
        const [[user]] = await connection.query(query, [email])

        if (!user) return true;
        else return false;
    } catch (err) {
        console.log("Error something went wrong: ", err)
    }
}

async function createUser(user, callback) {
    try {
        const { name, email, password, phone, biography, website, facebook, instagram, twitter, linkedin, youtube, admin } = user;

        if (await isEmailInUse(email)) {
            return callback({ status: 409, message: "Email already in use." });
        }

        const saltRounds = 10;
        
        const hashedPassword = await bcrypt.hash("password", saltRounds);
        const insertUserQuery = `
            INSERT INTO user (name, email, password, phone, biography, website, facebook, instagram, twitter, linkedin, youtube, admin)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await connection.query(insertUserQuery, [name, email, hashedPassword, phone, biography, website, facebook, instagram, twitter, linkedin, youtube, admin]);

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

module.exports = {
    authenticate,
    createUser,
};