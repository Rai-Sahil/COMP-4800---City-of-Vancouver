
var express = require('express');
var fs = require('fs');
var multer = require('multer');
var sharp = require('sharp');
var router = express.Router();
var path = require('path');

const FILESIZE_MAX_BYTES = 2000000;

router.delete("/", (req, res) => {
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

module.exports = router;