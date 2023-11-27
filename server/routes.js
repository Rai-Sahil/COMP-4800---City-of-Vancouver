const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');
const FILESIZE_MAX_BYTES = 2000000;
const { createUser, authenticate, mainConnection } = require('./db');
// Required login and logout functions from middleware.js
const { requireLogin, requireLogout } = require('./middleware');
const { randomUUID } = require('crypto');
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
    res.sendFile("header.html", {
        root: path.join(__dirname, '../views')
    });
});

app.get('/about', (req, res) => {
    res.sendFile("about.html", {
        root: path.join(__dirname, '../views')
    });
});

app.get('/userform', (req, res) => {
    res.sendFile("userform.html", {
        root: path.join(__dirname, '../views')
    });
});

app.get('/userProfile', (req, res) => {
    res.sendFile("userProfile.html", {
        root: path.join(__dirname, '../views')
    });
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = authenticate(username, password, (user) => {
        if (user !== null) {
            req.session.user = user.name;
            req.session.uuid = user.uuid;
            req.session.loggedIn = true;
            req.session.save(() => {
                (err) => err && console.log("Unable to save the session", err);
            })
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    })
});

const upload = () => 
{
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

app.post('/userform-submit', upload(), (req, res) => {
    const user = {
        name: req.body.name,
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
        preference: req.body.medium,
    };

    console.log(req.body);
    tempData.push(user);

    const dummyUUID = Math.floor(Math.random() * 1000);

    console.log(req.session.uuid);
    //req.body.uuid = req.session.uuid;
    req.body.uuid = dummyUUID;
    try 
    {
        createFiles(req, res);
    }
    catch (err) 
    {
        res.status(400).send("Error uploading images");
        return;
    }
        
    const bcResident = user.bcResident === 'no' ? 0 : 1;
    const experience = user.experience === 'no' ? 0 : 1;

    const query = `CALL createApplication(${dummyUUID}, '${user.name}', '${user.email}', '${user.phone}', '${user.website}', '${user.instaHandle}', '${user.facebookHandle}', ${bcResident}, ${experience}, '${user.experienceDescription}', '${user.biography}', '${user.genre}', '${user.cultural}', '${user.preference}');`

    mainConnection.query(query, function (err, result) 
    {
        if (err) 
        {
            res.status(500).send("Could not register user");
            return;
        }
        else
        {
            res.render("Components/successfullSubmission")
        }
    });

});

app.use("/admin", (req, res, next) => {
    const token = req.query.token;

    if (token === secretToken) {
        res.send(generateAdminDashboard());
        next();
    } else {
        res.status(403).send("Access Denied");
    }
});

app.post("/accept/:index", (req, res) => {
    const index = req.params.index;
    const user = tempData[index];

    createUser(user, (response) => {
        console.log(response);
    });

    tempData.splice(index, 1);
    console.log(tempData);
    res.send(generateAdminDashboard());
});

app.post("/reject/:index", (req, res) => {
    const index = req.params.index;
    const user = tempData[index];

    rejectedUsers.push(user);

    tempData.splice(index, 1);

    res.send(generateAdminDashboard());
});

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
    });
    dashboard += '</body></html>';
    return dashboard;
}



const createFiles = async (req, res) => 
{
    console.log("hellow world");
    let uuid = req.body.uuid;


    const regex = /^[a-zA-Z0-9]{1,20}$/;
    if (!regex.test('1234abc')) {
        res.status(400).send();
        return;
    }

    // check if artistId exists
    // TODO

    const path = `public/artistImages/${uuid}/`;
    if (fs.existsSync(path)) {
        // check if artist has been approved
        // TODO


        // if artist has been approved, dont let them upload again
        // {
        //     res.status(400).send("Artist has already been approved, cannot upload again");
        //     return;
        // }
        // else
        // {
        fs.rmSync(path, { recursive: true });
        // }
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