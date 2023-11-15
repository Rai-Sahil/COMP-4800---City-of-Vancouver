
const mysql = require("mysql2");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "roster_database"
});

function pushApplication(user) {
    connection.connect();
    connection.execute(
        `insert into user_application values 
        (name, email, phone, website, instaHandle,
        facebookHandle, bcResident, experience,
        experienceDescription, biography, genre,
        cultural, preference)`,
        [user.name, user.email, user.phone, user.website,
        user.instaHandle, user.facebookHandle, user.bcResident, 
        user.experience, user.experienceDescription, user.biography,
        user.genre, user.cultural, user.preference],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            console.log("results:", results);
        }
    );
}

module.exports = {
    pushApplication
};