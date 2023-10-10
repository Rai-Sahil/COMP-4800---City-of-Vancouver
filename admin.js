const express = require('express');
const router = express.Router();
const path = require('path');
const pendingUsers = require('./app')

router.get('/', (req, res) => {
  // Render the admin dashboard HTML file
  res.sendFile(path.join(__dirname, 'admin.html'));
});

router.get('/pending-users', (req, res) => {
  // Get and send the list of pending user registrations
  const pendingUserList = Object.values(pendingUsers);
  res.json(pendingUserList);
});

module.exports = router;
