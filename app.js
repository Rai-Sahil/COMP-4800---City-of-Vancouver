const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) 
  {
    cb(null, './artistImages')
  },
  filename: function (req, file, cb) 
  {
    cb(null, file.fieldname + path.extname(file.originalname))
  }
})


const upload = multer({ storage: storage,
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
  },
  limits: { fileSize: 2000000 }
}).array('file', 8);


app.post('/upload',  (req, res) => {
  upload(req, res, function (err) 
  {
    if (err) {
      return res.end("Error uploading file.");
    }
    res.end("File is uploaded");
  });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));

// In-memory database
const users = {};
const pendingUsers = {}; // Dictionary to store pending user registrations

// Routes
app.use('/admin', require('./admin'));
app.use('/user', require('./user'));
app.use(express.static('public'))
// New user registration endpoint
app.post('/register', (req, res) => {
  const { name, email, description, images } = req.body;
  const userId = email; // Use email as a unique identifier for users

  // Store the user's registration data in the pendingUsers dictionary
  pendingUsers[userId] = { name, email, description, images };

  res.status(200).send('Registration request sent to admin for approval.');
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});

module.exports.pendingUsers = pendingUsers;
