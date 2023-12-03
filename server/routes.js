const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');
const FILESIZE_MAX_BYTES = 2000000;
const { createUser, authenticate, mainConnection, giveAdminUserApplication, approveUserApplication, 
    removeUserApplication } = require('./db');
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

app.get('/userProfile', requireLogin, (req, res) => {
    res.sendFile("userProfile.html", {
        root: path.join(__dirname, '../views')
    });
});

app.get('/admin', (req, res) => {
    res.sendFile("admin.html", {
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
        preference: req.body.preference,
    };

    console.log(req.body);
    tempData.push(user);

    const dummyUUID = Math.floor(Math.random() * 1000);

    console.log(req.session.uuid);
    //req.body.uuid = req.session.uuid;
    req.body.uuid = dummyUUID;
    try {
        createFiles(req, res);
    } catch (err) 
    {
        res.status(400).send("Error uploading images");
        return;
    }
        
    const bcResident = user.bcResident === 'no' ? 0 : 1;
    const experience = user.experience === 'no' ? 0 : 1;

    const query = `CALL createApplication(${dummyUUID}, '${user.name}', '${user.email}', '${user.phone}', '${user.website}', '${user.instaHandle}', '${user.facebookHandle}', ${bcResident}, ${experience}, '${user.experienceDescription}', '${user.biography}', '${user.genre}', '${user.cultural}', '${user.preference}');`

    mainConnection.query(query, function (err, result) {
        if (err) {
            res.status(500).send("Could not register user");
            return;
        } else {
            res.render("../views/Components/successfullSubmission.ejs");
        }
    });
});

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

app.post("/reject/:uuid", (req, res) => {
    const { uuid } = req.params;
    const { comment } = req.body;
    console.log('uuid is ', uuid);
    console.log('comment is ', comment);

    removeUserApplication(uuid, (response) => {
        console.log('Response is ', response);
    });

    res.sendFile("admin.html", {
        root: path.join(__dirname, '../views')
    });
});

app.get('/artists', (req, res) => 
{
    const query = `CALL getPartialApplications();`;

    mainConnection.query(query, function(err, result)
    {
        if (err)
        {
            res.status(500).send("Could not get artists");
            return;
            //throw err;  
        }

        let partialArtists = [];

        console.log(result[0]);
        for (let i = 0; i < result[0].length; i++)
        {
            let image;

            if(fs.existsSync(`public/artistImages/${result[0][i].uuid}/`))
            {
                let imagePaths = fs.readdirSync(`public/artistImages/${result[0][i].uuid}/`, { withFileTypes: true });
                image = `artistImages/${result[0][i].uuid}/${imagePaths[0].name}`;
            }
            else
            {
                continue;
            }

            let partialArtist = {uuid: result[0][i].uuid, name: result[0][i].name, cultural: result[0][i].cultural, preference: result[0][i].preference, genre: result[0][i].genre , image: image};
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

app.delete("/imageUpload", (req, res) => {
    const uuid = req.body.uuid;
    const token = req.body.token;

    if (token !== secretToken) {
        res.status(403).send("Access Denied");
        return;
    }

    const regex = /^[a-zA-Z0-9]{1,20}$/;
    if (!regex.test(uuid)) {
        res.status(400).send("Invalid artistId");
        return;
    }

    // check if artistId exists
    // TODO

    const path = `public/artistImages/${uuid}/`;
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