const express = require("express");
const router = express.Router();
const lineAPIController = require("../controller/lineAPI");
const handleErrorAsync = require("../service/handleErrorAsync");
router.get(
  "/line/authorize",
  handleErrorAsync(async (req, res, next) =>
    lineAPIController.authorize(req, res, next)
  )
); //https://access.line.me/oauth2/v2.1/ssoLogin?loginChannelId=1657154166&returnUri=%2Foauth2%2Fv2.1%2Fauthorize%2Fconsent%3Fscope%3Dopenid%2Bprofile%2Bemail%26response_type%3Dcode%26redirect_uri%3Dhttps%253A%252F%252Fintense-fortress-59028.herokuapp.com%252F%26state%3D123123%26client_id%3D1657154166
// callback
router.get(
  "/cb",
  handleErrorAsync(async (req, res, next) =>
    lineAPIController.cb(req, res, next)
  )
);
router.post(
  "/line/token",
  handleErrorAsync(async (req, res, next) =>
    lineAPIController.getLinetoken(req, res, next)
  )
); //https://intense-fortress-59028.herokuapp.com/?code=MtKd8W32KlL4trPnt18N&state=123123

router.post(
  "/line/userInfo",
  handleErrorAsync(async (req, res, next) =>
    lineAPIController.getLineUserInfo(req, res, next)
  )
);
module.exports = router;
