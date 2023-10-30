const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));

// In-memory database
const users = {};
const pendingUsers = {}; // Dictionary to store pending user registrations

// Routes
app.use('/upload', require('./upload'));
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
