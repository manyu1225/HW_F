const express = require('express');
const router = express.Router();
const handleErrorAsync = require("../service/handleErrorAsync");
const handleSuccess = require("../service/handleSuccess");
const httpStatus = require("../utils/httpStatus");
const uploadImage = require('../service/uploadImage');
const saveImage = require('../service/saveImage');

router.post('/', uploadImage,handleErrorAsync(async (req, res, next)=> {

  const data =  await saveImage(req, res, next);
  handleSuccess(res, httpStatus.OK, data);
}));

module.exports = router;