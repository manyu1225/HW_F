const express = require('express');
const router = express.Router();
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");
const uploadImage = require('../service/uploadImage');
const { ImgurClient } = require('imgur');

router.post('/', uploadImage,handleErrorAsync(async (req, res, next)=> {
    if(!req.files.length) {
      return next(appError(400,"尚未上傳檔案",next));
    }

    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENTID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN,
    });
    const response = await client.upload({
      image: req.files[0].buffer.toString('base64'),
      type: 'base64',
      album: process.env.IMGUR_ALBUM_ID
    });

    if(response.data && response.data.link){
      res.status(200).json({
        status:"success",
        imgUrl: response.data.link.split('/').pop()
      });
    }else{

    }    
}));

module.exports = router;