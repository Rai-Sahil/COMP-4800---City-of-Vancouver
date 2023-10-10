const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  // Send the user dashboard HTML file
  res.sendFile(path.join(__dirname, 'user.html'));
});

module.exports = router;
