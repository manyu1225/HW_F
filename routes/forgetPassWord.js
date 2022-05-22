const express = require("express");
const router = express.Router();
const forgetPWController = require('../controller/forgetPassWord');
const usersController =require('../controller/users');
const isDbToken = require("../middleware/tokenCheck");
const tokenCheck =require('../middleware/tokenCheck');



router.post(
    /*  #swagger.tags = ['forget']
      #swagger.description = '忘記密碼_寄信'
      #swagger.path = '/forget'
      #swagger.method = 'POST'
      #swagger.produces = ["application/json"]
      #swagger.security = [{ "Bearer": [] }]
      #swagger.parameters['body'] = {
        in: 'body',
        type :"object",
        required:true,
        description: "資料格式",
        schema: {
                "$email":"test@gmail.com"
            }
        }
   */
"/", 
async(req, res, next)=> forgetPWController.sentMailForChangePW(req,res,next)
);


router.post(
    /*  #swagger.tags = ['forget']
      #swagger.description = '忘記密碼_修改密碼'
      #swagger.path = '/forget/Update'
      #swagger.method = 'POST'
      #swagger.produces = ["application/json"]
      #swagger.security = [{ "Bearer": [] }]
      #swagger.parameters['body'] = {
        in: 'body',
        type :"object",
        required:true,
        description: "資料格式",
        schema: {
                "$password":"a12345678",
                "$passwordConfirm":"a12345678"
            }
        }
   */
  "/Update", 
  isDbToken,
  async(req, res, next)=>usersController.updatePassword(req,res,next)
);

module.exports = router;
