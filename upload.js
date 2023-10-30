const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

router.post('/', (req, res) => 
{
    console.log("Upload request received");
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    let artistId = req.query.artistId;

    const regex = /^[a-zA-Z0-9]{1,20}$/;
    if(!regex.test(artistId))
    {
        res.status(400).send("Invalid artistId");
        return;
    }

    upload(artistId)(req, res, function (err) 
    {
        if (err instanceof multer.MulterError) 
        {
            return res.status(500).json(err);
        } 
        else if (err) 
        {
            return res.status(500).json(err);
        }
        
        bob(req, res);
    });

    const bob = async (req, res) =>
    {
        const path = `artistImages/${artistId}/`;
        fs.rmSync(path, { recursive: true});
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
            fs.rm(path, { recursive: true});
            res.status(500).send(err);
        }

        res.status(200).send();
    };
}
);

const upload = (artistId) => 
{
  let currentFile = 0;

  return imageUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2000000 },
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
  }).array('file', 8);
}

module.exports = router;