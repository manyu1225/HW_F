const express = require("express");
const router = express.Router();
const UsersController = require("../controller/users");
const handleErrorAsync = require("../service/handleErrorAsync");
const auth = require("../middleware/auth");

router.post(
  /*   #swagger.tags = ['Users']
      #swagger.description = 'User註冊'
      #swagger.path = '/users/sign_up'
      #swagger.method = 'POST'
      #swagger.produces = ["application/json"]
      #swagger.parameters['body'] = {
        in: 'body',
        type :"object",
        required:true,
        description: "資料格式",
        schema: {
                "$name": 'HELLOYO',
                "$email":'d@gmail.com',
                "$password":'123456',
            }
        }
   */
  "/sign_up",
  handleErrorAsync(async (req, res, next) =>
    UsersController.register(req, res, next)
  )
);
router.post(
  /* #swagger.tags = ['Users']
     #swagger.description = 'User登入'
     #swagger.path = '/users/sign_in'
     #swagger.method = 'POST'
     #swagger.produces = ["application/json"]
     #swagger.parameters['body'] = {
        in: 'body',
        type :"object",
        required:true,
        description: "資料格式",
        schema: {
               "$email":'d@gmail.com',
               "$password":'123456',
            }
        }
  */
  "/sign_in",
  handleErrorAsync(async (req, res, next) =>
    UsersController.signin(req, res, next)
  )
);
//登入後才可以重設密碼
router.post(
  /* #swagger.tags = ['Users']
     #swagger.description = '重設密碼'
     #swagger.path = '/users/updatePassword'
     #swagger.method = 'POST'
     #swagger.produces = ["application/json"]
     #swagger.parameters['body'] = {
        in: 'body',
        type :"object",
        required:true,
        description: "資料格式",
        schema: {
                "$password":'123456',
                "$newpassword":'1234567',
            }
        }
     #swagger.security = [{
          "Bearer": []
     }]
  */
  "/updatePassword",
  auth.isAuth,
  handleErrorAsync(async (req, res, next) =>
    UsersController.updatePassword(req, res, next)
  )
);
//需設計 isAuth middleware
router.get(
  /* #swagger.tags = ['Users']
     #swagger.description = '取得個人資料'
     #swagger.path = '/users/profile'
     #swagger.method = 'GET'
     #swagger.produces = ["application/json"]
     #swagger.security = [{
         "Bearer": []
     }]
  */
  "/profile",
  auth.isAuth,
  handleErrorAsync(async (req, res, next) =>
    UsersController.getProfile(req, res, next)
  )
);
//需設計 isAuth middleware
router.patch(
  /*  #swagger.tags = ['Users']
      #swagger.description = '更新個人資料'
      #swagger.path = '/users/profile'
      #swagger.method = 'PATCH'
      #swagger.produces = ["application/json"]
      #swagger.security = [{
         "Bearer": []
      }]
      #swagger.parameters['body'] = {
        in: 'body',
        type :"object",
        description: "資料格式",
        schema: {
                "name": 'Jhon DoeC',
                "photo": 'BBB'
            }
        }
     */
  "/profile",
  auth.isAuth,
  handleErrorAsync(async (req, res, next) =>
    UsersController.updateProfile(req, res, next)
  )
);
router.delete(
  /*
    #swagger.ignore = true
   */
  "/:id",
  handleErrorAsync(async (req, res, next) =>
    UsersController.delUser(req, res, next)
  )
);
router.get(
  /*#swagger.tags = ['Users']
    #swagger.description = 'Endpoint to get All Users'
    #swagger.path = '/users'
    #swagger.method = 'GET'
    #swagger.responses[200] = { description: 'Some description...' }
   */
  "/",
  handleErrorAsync(async (req, res, next) =>
    UsersController.getAllUsers(req, res, next)
  )
);
router.get(
  /* #swagger.tags = ['Users']
     #swagger.description = '取得個人資料'
      #swagger.path = '/users/{email}'
      #swagger.method = 'GET'
      #swagger.produces = ["application/json"]
  */
  "/:id",
  handleErrorAsync(async (req, res, next) =>
    UsersController.getUser(req, res, next)
  )
);
router.delete(
  /* 
  #swagger.tags = ['Users']
  #swagger.path = '/users'
  #swagger.method = 'DELETE'
  */
  "/",
  handleErrorAsync(async (req, res, next) =>
    UsersController.delAllUsers(req, res, next)
  )
);

module.exports = router;
