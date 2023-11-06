const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');
const FILESIZE_MAX_BYTES = 2000000; // 2MB

const app = express();
const port = 3000;
const secretToken = "admin123";

const tempData = [];
const permanentUsers = [];
const rejectedUsers = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('views'));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.set('views', './imageUpload');
app.set('view engine', 'ejs');

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === 'user' && password === 'user') {
        req.session.authenticated = true;
        res.redirect(`/`);
    } else {
        res.redirect('/login.html');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login.html');
    });
});

function checkAuthenticated(req, res, next) {
    if (req.session.authenticated) {
        next();
    } else {
        res.redirect('/login.html');
    }
}

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
  res.render('imageform', { artistId: user.name });

  //res.redirect("/successfulSubmission.html");
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

  permanentUsers.push(user);

  tempData.splice(index, 1);

  console.log("permanentUsers", permanentUsers);
  console.log("tempData", tempData);

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
            <p>Genres: ${
              Array.isArray(user.genre) ? user.genre.join(", ") : user.genre
            }</p>
            <p>Cultural Categories: ${
              Array.isArray(user.cultural)
                ? user.cultural.join(", ")
                : user.cultural
            }</p>
            <p>Preferences: ${
              Array.isArray(user.preference)
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

app.post('/imageUpload', (req, res) => 
{
    upload()(req, res, function (err) 
    {
        if (err instanceof multer.MulterError) 
        {
            return res.status(400).json("Multer error");
        } 
        else if (err) 
        {
            return res.status(400).json("Unknown error");
        }
        
        bob(req, res);
    });

    const bob = async (req, res) =>
    {
        let artistId = req.body.artistId;

        const regex = /^[a-zA-Z0-9]{1,20}$/;
        if(!regex.test(artistId))
        {
            res.status(400).send("Invalid artistId");
            return;
        }
    
        // check if artistId exists
        // TODO

        const path = `public/artistImages/${artistId}/`;
        if(fs.existsSync(path))
        {
            fs.rmSync(path, { recursive: true});
        }

        fs.mkdirSync(path, { recursive: true });
        let files = req.files;

        try
        {
            for (let i = 0; i < files.length; i++)
            {
                await sharp(files[i].buffer).toFormat('jpeg').toFile(path + i + '.jpeg');
            }
        }
        catch (err)
        {
            //delete all files we just uploaded
            if(fs.existsSync(path))
            {
                fs.rm(path, { recursive: true});
            }
            res.status(400).send("Error converting images");
        }

        res.redirect("/successfulSubmission.html");
    };
}
);

const upload = (artistId) => 
{
  let currentFile = 0;

  return imageUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: FILESIZE_MAX_BYTES },
    fileFilter: function (req, file, cb) 
    {
      var filetypes = /jpeg|jpg|png/;
      var mimetype = filetypes.test(file.mimetype);
      var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
      if (mimetype && extname) 
      {
        return cb(null, true);
      }
      
      cb("Error: File upload only supports the following filetypes - " + filetypes);
    }
  }).array('image', 8);
}

app.listen(port, () => {
    console.info(`Server is running on http://localhost:${port}`);
});
