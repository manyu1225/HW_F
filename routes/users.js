const express = require("express");
const router = express.Router();
const UsersController = require("../controller/users");
const handleErrorAsync = require("../service/handleErrorAsync");
const auth = require("../middleware/auth");

router.get(
  /*#swagger.tags = ['Users']
    #swagger.description = 'Endpoint to get All Users'
    #swagger.path = '/users'
    #swagger.method = 'GET'
    #swagger.responses[200] = { description: 'Some description...' }
   */
  "/users",
  handleErrorAsync(async (req, res, next) =>
    UsersController.getAllUsers(req, res, next)
  )
);

router.post(
  /* #swagger.tags = ['Users']
     #swagger.description = '登入'
     #swagger.path = '/users/sign_in'
     #swagger.method = 'POST'
     #swagger.produces = ["application/json"]
     #swagger.parameters['body'] = {
        in: 'body',
        type :"object",
        required:true,
        description: "資料格式",
        schema: {
               "$email":'test@gmail.com',
               "$password":'a12345678',
            }
        }
  */
  "/users/sign_in",
  handleErrorAsync(async (req, res, next) =>
    UsersController.signin(req, res, next)
  )
);
router.post(
  /*  #swagger.tags = ['Users']
      #swagger.description = '註冊'
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
                "$email":'test@gmail.com',
                "$password":'a12345678',
            }
        }
   */
  "/users/sign_up",
  handleErrorAsync(async (req, res, next) =>
    UsersController.register(req, res, next)
  )
);

router.delete(
  /*
    #swagger.ignore = true
   */
  "/user/:id",
  handleErrorAsync(async (req, res, next) =>
    UsersController.delUser(req, res, next)
  )
);
// POST：{url}/users/updatePassword: 重設密碼，登入後才可以重設密碼
router.post(
  /* #swagger.tags = ['Users']
     #swagger.description = '重設密碼'
     #swagger.path = '/user/updatePassword'
     #swagger.method = 'POST'
     #swagger.produces = ["application/json"]
     #swagger.parameters['body'] = {
        in: 'body',
        type :"object",
        required:true,
        description: "密碼需至少 8 碼以上",
        schema: {
                "$password":'a123456789',
            }
        }
     #swagger.security = [{
          "Bearer": []
     }]
  */
  "/user/updatePassword",
  auth.isAuth,
  handleErrorAsync(async (req, res, next) =>
    UsersController.updatePassword(req, res, next)
  )
);
router.get(
  /* #swagger.tags = ['Users']
     #swagger.description = '取得個人資料'
     #swagger.path = '/user/profile'
     #swagger.method = 'GET'
     #swagger.produces = ["application/json"]
     #swagger.security = [{
         "Bearer": []
     }]
  */
  "/user/profile",
  auth.isAuth,
  handleErrorAsync(async (req, res, next) =>
    UsersController.getProfile(req, res, next)
  )
);
// PATCH：{url}/users/profile: 更新個人資料，需設計 isAuth middleware
router.patch(
  /*  #swagger.tags = ['Users']
      #swagger.description = '更新個人資料'
      #swagger.path = '/user/profile'
      #swagger.method = 'PATCH'
      #swagger.produces = ["application/json"]
      #swagger.security = [{
         "Bearer": []
      }]
      #swagger.parameters['body'] = {
        in: 'body',
        type :"object",
        required:true,
        description: "資料格式",
        schema: {
                "$name": 'Jhon DoeC',
                "$photo": 'https://carolchyang.github.io/nodeFinal/img/login.e25e826d.png'
            }
        }
     */
  "/user/profile",
  auth.isAuth,
  handleErrorAsync(async (req, res, next) =>
    UsersController.updUser(req, res, next)
  )
);
module.exports = router;
