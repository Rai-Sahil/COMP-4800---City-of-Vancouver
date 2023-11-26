"use strict";

const express = require('express');
const session = require('express-session');

const app = express();
const imageUpload = require('./server/routes/imageUpload');
const artists = require('./server/routes/artists');

app.use(express.static('public'));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        name: "teamname.sid",
        resave: false,
        saveUninitialized: false,
        secret: "secret",
    })
)

app.use(require('./server/routes'));
app.use('/imageUpload', imageUpload);
app.use('/artists', artists);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));