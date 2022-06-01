const express = require("express");
const router = express.Router();
const lineAPIController = require("../controller/lineAPI");
const handleErrorAsync = require("../service/handleErrorAsync");
router.get(
  /* #swagger.tags = ['Users']
     #swagger.description = 'LINE登入'
     #swagger.summary= 'LINE登入'
     #swagger.path = '/line/authorize'
     #swagger.method = 'GET'
     #swagger.produces = [""]
  */
  "/authorize",
  handleErrorAsync(async (req, res, next) =>
    lineAPIController.authorize(req, res, next)
  )
);
router.get(
  /*
    #swagger.ignore = true
   */
  "/callback",
  handleErrorAsync(async (req, res, next) =>
    lineAPIController.callback(req, res, next)
  )
);
router.post(
  /*#swagger.tags = ['Users']
    #swagger.description = '利用LINE TOKEN取個人資料(測試用)'
    #swagger.summary='利用LINE TOKEN取個人資料(測試用)'
    #swagger.path = '/line/userInfo'
    #swagger.method = 'POST'
    #swagger.produces = ["application/x-www-form-urlencoded"]
    #swagger.parameters['body'] = {
     in: 'body',
     type:"object",
     required: true,
     description: "資料格式",
     schema: {
                "$access_token": 'eyJhbGciOiJIUzI1NiJ9.s0l1EmYB25ysUIUdT8sUhX-a7IPwLDjI8Pj4-NySnNZYx5YWdlAti9chTsHGCUKIHcIoRLv5xcV4QCvS7dAUrD1X4YP_bBb42HyDZl4xLNgntpvwXmlw4vror0gLa_g90F8UwIQPZ0xvm8QLtgxBvv5T91fdT8i1Pgc1sQ688Xo.fxMngyaDzhvDA_ICH87D-9UAPYJzpvcPwmNe1YhLW3E',
                
            }
    }
   */
  "/userInfo",
  handleErrorAsync(async (req, res, next) =>
    lineAPIController.getLineUserInfo(req, res, next)
  )
);
module.exports = router;
