const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');
const FILESIZE_MAX_BYTES = 2000000;
const { createUser, authenticate, mainConnection, updatePassword, giveAdminUserApplication, approveUserApplication, 
    removeUserApplication } = require('./db');
const { requireLogin, requireLogout } = require('./middleware');
const { randomUUID } = require('crypto');
const { JSDOM } = require('jsdom');
const { red, white } = require('colors');
const app = express.Router();
const secretToken = 'admin123';

const tempData = [];
const permanentUsers = [];
const rejectedUsers = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile("index.html", {
        root: path.join(__dirname, '../views')
    });
});

app.get('/login', requireLogout, (req, res) => {
    res.sendFile("login.html", {
        root: path.join(__dirname, '../views')
    });
});

app.get('/header', (req, res) => {
    let headerBar = fs.readFileSync(path.join(__dirname, '../views', "header.html"));
    let headerBarDOM = new JSDOM(headerBar);
    if (req.session.admin) {
        giveAdminUserApplication((data) => {
            res.send(notifyAdminForApplication(headerBarDOM, data));
        });
    } else {
        res.send(headerBarDOM.serialize());
    } 
});

app.get('/about', (req, res) => {
    res.sendFile("about.html", {
        root: path.join(__dirname, '../views')
    });
});

app.get('/userform', requireLogout, (req, res) => {
    res.sendFile("userform.html", {
        root: path.join(__dirname, '../views')
    });
});

app.get('/userProfile', (req, res) => {
    res.sendFile("userProfile.html", {
        root: path.join(__dirname, '../views')
    });
});

app.get('/accountSettings', (req, res) => {
    res.sendFile("accountSettings.html", {
        root: path.join(__dirname, '../views')
    });
});

app.get('/admin', (req, res) => {
    res.sendFile("admin.html", {
        root: path.join(__dirname, '../views')
    });
});

app.post('/login', requireLogout, (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = authenticate(username, password, (user) => {
        if (user !== null) {
            req.session.user = user.name;
            req.session.email = user.email;
            req.session.uuid = user.uuid;
            req.session.loggedIn = true;
            req.session.admin = user.admin.toJSON().data[0] ? true : false;
            console.log(req.session.admin);
            req.session.save(() => {
                (err) => err && console.log("Unable to save the session", err);
            })
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    })
});

const upload = () => {
    return imageUpload = multer({
        storage: multer.memoryStorage(),
        limits: { fileSize: FILESIZE_MAX_BYTES },
        fileFilter: function (req, file, cb) {
            var filetypes = /jpeg|jpg|png/;
            var mimetype = filetypes.test(file.mimetype);
            var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

            if (mimetype && extname) {
                return cb(null, true);
            }

            cb("Error: File upload only supports the following filetypes - " + filetypes);
        }
    }).array('image', 8);
}

app.get('/user-session', (req, res) => {
    res.json(req.session);
})

app.post('/userform-submit', upload(), (req, res) => {
    const user = {
        name: req.body.name,
        pronoun: req.body.pronoun,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        website: req.body.website,
        instaHandle: req.body.instaHandle,
        facebookHandle: req.body.facebookHandle,
        bcResident: req.body.BCResident,
        experience: req.body.experience,
        experienceDescription: req.body.experienceDescription,
        biography: req.body.biography,
        genre: req.body.genre,
        cultural: req.body.cultural,
        preference: req.body.preference,
    };

    //const dummyUUID = Math.floor(Math.random() * 1000);
    createUser(user, (response) => {
        //req.body.uuid = req.session.uuid;
        if(response.status === 409) {
            res.status(409).send("Email already in use");
            return;
        }

        req.body.uuid = response.user.uuid;
        try {
            createFiles(req, res);
        } catch (err) {
            res.status(400).send("Error uploading images");
            return;
        }

        const bcResident = user.bcResident === 'no' ? 0 : 1;
        const experience = user.experience === 'no' ? 0 : 1;

        const query = `CALL createApplication(${response.user.uuid}, '${user.name}', '${user.email}', '${user.phone}', '${user.website}', '${user.instaHandle}', '${user.facebookHandle}', ${bcResident}, ${experience}, '${user.experienceDescription}', '${user.biography}', '${user.genre}', '${user.cultural}', '${user.preference}');`

        mainConnection.query(query, function (err, result) {
            if (err) {
                res.status(500).send("Could not register user ");
                console.log("Error in server side " + err);
                return;
            } else {
                res.render("../views/Components/successfullSubmission.ejs");
            }
        });

    });


});

app.post('/password-submit', (req, res) => {
    console.log(req.body);
    const password = {
        oldPassword: req.body.old,
        newPassword: req.body.new,
        confirmPassword: req.body.confirm
    };
    console.log(password);
    const user = authenticate(req.session.email, password.oldPassword, (user) => {
        if (user !== null) {
            if (password.newPassword === password.confirmPassword) {
                console.log("HERE");
                if (updatePassword(req.session.email, password.newPassword)) {
                    res.status(200).send("Password change success");
                } else {
                    res.status(200).send("Password change failure")
                };
            } else {
                res.status(400).send("New passwords must match");
            }
        } else {
            res.status(400).send("Wrong old password");
        }
    })
})

app.use("/admin/user_application", (req, res, next) => {

    giveAdminUserApplication((data) => {
        console.log('Users are ', data[0][0]);
        if (data[0] !== null) {
            // res.status(200).send(generateAdminDashboard(data[0]));
            res.status(200).send(data[0]);
        }
    });
});

app.post("/accept/:email", (req, res) => {
    const { email } = req.params;
    approveUserApplication(email, (response) => {
        console.log('Response is ', response);
    });

    res.sendFile("admin.html", {
        root: path.join(__dirname, '../views')
    });
});

app.post("/reject/:email", (req, res) => {
    const { email } = req.params;

    const comment = req.body.comment;
    const uuid = req.body.uuid;

    removeUserApplication(email, (response) => {
        console.log('Response is ', response);
    });

    try {
        const path = `public/artistImages/${uuid}/`;
        if (fs.existsSync(path)) {
            fs.rmSync(path, { recursive: true });
        }
    } catch (err) {
        console.log("Error deleting images: ", err);
    }

    res.sendFile("admin.html", {
        root: path.join(__dirname, '../views')
    });
});

app.get('/artists', (req, res) => {
    const query = `CALL getPartialApprovedApplications();`;

    mainConnection.query(query, function (err, result) {
        if (err) {
            res.status(500).send("Could not get artists");
            return;
            //throw err;  
        }

        let partialArtists = [];

        for (let i = 0; i < result[0].length; i++) {
            let image;

            if (fs.existsSync(`public/artistImages/${result[0][i].uuid}/`)) {
            
                let imagePaths = fs.readdirSync(`public/artistImages/${result[0][i].uuid}/`, { withFileTypes: true });
                image = `artistImages/${result[0][i].uuid}/${imagePaths[0].name}`;
            }
            else {
                continue;
            }

            let partialArtist = { uuid: result[0][i].uuid, name: result[0][i].name, cultural: result[0][i].cultural, preference: result[0][i].preference, genre: result[0][i].genre, image: image };
            partialArtists.push(partialArtist);
        }
        const stringified = JSON.stringify(partialArtists);
        res.contentType('application/json');
        res.send(stringified);
    });

});

app.get('/artists/single', (req, res) => 
{
    const artistId = req.query.id;

    const query = `CALL getArtistById(${artistId});`;

    mainConnection.query(query, function(err, result)
    {
        if (err)
        {

            res.status(500).send("Could not get artists");
            return;
            //throw err;  
        }

        if(result[0].length == 0)
        {
            res.status(404).send("Artist not found");
            return;
        }

        let artist = result[0][0];

        artist.images = [];
        // SWITCH TO UUID
        let imagePaths = fs.readdirSync(`public/artistImages/${artistId}/`, { withFileTypes: true });
        for (let j = 0; j < imagePaths.length; j++)
        {
            artist.images.push(`artistImages/${artistId}/${imagePaths[j].name}`);
        }
            

        res.contentType('application/json');
        res.json(artist);
    });
});

function notifyAdminForApplication(headerBarDOM, data) {
        let nav = headerBarDOM.window.document.getElementsByClassName("nav-links")[0];

        let applications = headerBarDOM.window.document.createElement("a");
        applications.className = "admin-link"
        applications.href = "/admin";
        console.log("HERE");
        console.log(data[0]);
        
        if (data[0] && data[0].length > 0) {
            console.log("not null");
            applications.id = "notification-active";
            applications.innerHTML = "[" + (data[0].length) + "] Admin Dashboard";
            
            let hamburger = headerBarDOM.window.document.getElementsByClassName("hamburger")[0];
            hamburger.id = "notification-active";
            hamburger.innerHTML += "<b class='notification'>!</b>";

        } else {
            console.log("null");
            applications.innerHTML = "Admin Dashboard";
        }

        nav.insertBefore(applications, nav.children[1]);
        return headerBarDOM.serialize();   
}

function generateAdminDashboard() {
    let dashboard = `
  <!DOCTYPE html>
  <html>
  <head>
      <title>Admin Dashboard</title>
      <link rel="stylesheet" type="text/css" href="/css/adminDashboard.css">
  </head>
  <body>
      <h1>Admin Dashboard</h1>
  `;
    tempData.forEach((user, index) => {
        dashboard += `
        <div class="user-card" >
            <h3 >${user.name}'s Application Form:</h3>
            <p>Pronoun: ${user.pronoun}</p>
            <p>Email: ${user.email}</p>
            <p>Password: ${user.password}</p>
            <p>Phone: ${user.phone}</p>
            <p>Website: ${user.website}</p>
            <p>Instagram: ${user.instaHandle}</p>
            <p>Facebook: ${user.facebookHandle}</p>
            <p>BC Resident: ${user.bcResident}</p>
            <p>Experience: ${user.experience}</p>
            <p>Experience Description: ${user.experienceDescription}</p>
            <p>Biography: ${user.biography}</p>
            <p>Genres: ${Array.isArray(user.genre) ? user.genre.join(", ") : user.genre
            }</p>
            <p>Cultural Categories: ${Array.isArray(user.cultural)
                ? user.cultural.join(", ")
                : user.cultural
            }</p>
            <p>Preferences: ${Array.isArray(user.preference)
                ? user.preference.join(", ")
                : user.preference
            }</p>
            <div class="button-container">
                <form method="POST" action="/accept/${index}">
                    <button type="submit" class="accept-button">Accept</button>
                </form>
                <form method="POST" action="/reject/${index}">
                    <button type="submit" class="reject-button">Reject</button>
                </form>
            </div>        
        </div>
        `;

        if (result[0].length == 0) {
            res.status(404).send("Artist not found");
            return;
        }

        let artist = result[0][0];

        artist.images = [];
        // SWITCH TO UUID
        let imagePaths = fs.readdirSync(`public/artistImages/${artistId}/`, { withFileTypes: true });
        for (let j = 0; j < imagePaths.length; j++) {
            artist.images.push(`artistImages/${artistId}/${imagePaths[j].name}`);
        }


        res.contentType('application/json');
        res.json(artist);

    });
};

const createFiles = async (req, res) => {

    let uuid = req.body.uuid;

    const path = `public/artistImages/${uuid}/`;
    if (fs.existsSync(path)) {
        fs.rmSync(path, { recursive: true });
    }

    fs.mkdirSync(path, { recursive: true });
    let files = req.files;

    try {
        for (let i = 0; i < files.length; i++) {
            await sharp(files[i].buffer).toFormat('jpeg').toFile(path + i + '.jpeg');
        }
    }
    catch (err) {
        //delete all files we just uploaded
        if (fs.existsSync(path)) {
            fs.rm(path, { recursive: true });
        }
        res.status(400).send("Error converting images");
    }

};
module.exports = app;
