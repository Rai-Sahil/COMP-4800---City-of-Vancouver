const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');
const FILESIZE_MAX_BYTES = 2000000;
const { createUser, authenticate } = require('./db');
// Required login and logout functions from middleware.js
const { requireLogin, requireLogout } = require('./middleware');

const app = express.Router();
const secretToken = 'admin123';

const tempData = [];
const permanentUsers = [];
const rejectedUsers = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (_, res) => {
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

app.post('/userform-submit', (req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
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

    tempData.push(user);

    // Switch to the image upload page
    // REPLACE user.name with the artistId
    res.render('Components/imageform', { artistId: user.name });
    //res.render('Components/successfullSubmission');
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

app.post('/imageUpload', (req, res) => {

    upload()(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json("Multer error");
        }
        else if (err) {
            return res.status(400).json("Unknown error");
        }

        createFiles(req, res);
    });

    const createFiles = async (req, res) => {
        let artistId = req.body.artistId;

        const regex = /^[a-zA-Z0-9]{1,20}$/;
        if (!regex.test('1234abc')) {
            res.status(400).send(artistId);
            return;
        }

        // check if artistId exists
        // TODO

        const path = `public/artistImages/${artistId}/`;
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

        res.render('Components/successfullSubmission');
    };

}
);

const upload = (artistId) => {
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


app.delete("/imageUpload", (req, res) => {
    const artistId = req.body.artistId;
    const token = req.body.token;

    if (token !== secretToken) {
        res.status(403).send("Access Denied");
        return;
    }

    const regex = /^[a-zA-Z0-9]{1,20}$/;
    if (!regex.test(artistId)) {
        res.status(400).send("Invalid artistId");
        return;
    }

    // check if artistId exists
    // TODO

    const path = `public/artistImages/${artistId}/`;
    if (fs.existsSync(path)) {
        try {
            fs.rmSync(path, { recursive: true });
        }
        catch (err) {
            res.status(400).send("Error deleting images");
            return;
        }
    }
    else {
        res.status(400).send("Could not delete, directory does not exist");
        return;
    }

    res.send("Success");
});

module.exports = app;