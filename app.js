"use strict";

const express = require('express');
const session = require('express-session');

const app = express();

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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));