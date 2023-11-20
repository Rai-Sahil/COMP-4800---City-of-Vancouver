
var express = require('express');
var fs = require('fs');
var multer = require('multer');
var sharp = require('sharp');
var router = express.Router();
var path = require('path');
const { mainConnection } = require('../db');

const FILESIZE_MAX_BYTES = 2000000;


router.get('/', (req, res) => 
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

        for (let i = 0; i < result[0].length; i++)
        {
            // let images = [];
            // // SWITCH TO UUID
            // let imagePaths = fs.readdirSync(`public/artistImages/${result[0][i].name}/`, { withFileTypes: true });
            // for (let j = 0; j < imagePaths.length; j++)
            // {
            //     images.push(`artistImages/${result[0][i].name}/${imagePaths[j].name}`);
            // }
            
            let image;

            if(fs.existsSync(`public/artistImages/${result[0][i].name}/`))
            {
                let imagePaths = fs.readdirSync(`public/artistImages/${result[0][i].name}/`, { withFileTypes: true });
                image = `artistImages/${result[0][i].name}/${imagePaths[0].name}`;
            }
            else
            {
                continue;
            }

            let partialArtist = {uuid: result[0][i].uuid, name: result[0][i].name, cultural: result[0][i].cultural, preference: result[0][i].preference, genre: result[0][i].genre , image: image};
            partialArtists.push(partialArtist);
        }
        const stringified = JSON.stringify(partialArtists);
        console.log(stringified);
        res.contentType('application/json');
        res.send(stringified);
    });

});


module.exports = router;