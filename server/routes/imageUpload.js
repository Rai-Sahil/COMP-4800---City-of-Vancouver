
var express = require('express');
var fs = require('fs');
var multer = require('multer');
var sharp = require('sharp');
var router = express.Router();
var path = require('path');
const { mainConnection } = require('../db');

const FILESIZE_MAX_BYTES = 2000000;


router.post('/', (req, res) => {

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


router.delete("/", (req, res) => {
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

module.exports = router;