const express = require('express');
const router = express.Router();
const handleErrorAsync = require("../service/handleErrorAsync");
const handleSuccess = require("../service/handleSuccess");
const httpStatus = require("../utils/httpStatus");
const { uploadImage, handleUploadImageError } = require('../service/uploadImage');
const saveImage = require('../service/saveImage');

router.post(
  '/', 
  (req, res, next) => {
    //TODO：如果圖片欄位會有空值，需要自行跳過這段
    const uploadImageService = uploadImage.single('img');  

    //處理錯誤訊息
    uploadImageService(req, res, err => handleUploadImageError(err, next)); 
  }
  ,handleErrorAsync(async (req, res, next)=> {
    
    //存到圖床，回傳物件 { isSave, imgUrl }
    const data =  await saveImage(req, res, next);

    handleSuccess(res, httpStatus.OK, data);
  }));

module.exports = router;