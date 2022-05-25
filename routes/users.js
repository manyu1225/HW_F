const express = require("express");
const router = express.Router();
const UsersController = require("../controller/users");
const handleErrorAsync = require("../service/handleErrorAsync");
const auth = require("../middleware/auth");

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
// POST：{url}/users/updatePassword: 重設密碼，登入後才可以重設密碼
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
        description: "密碼需至少 8 碼以上，並中英混合",
        schema: {
                "$password":'password123',
                "$passwordConfirm":'password123',
            }
        }
     #swagger.security = [{
          "Bearer": []
     }]
  */
  "/users/updatePassword",
  auth.isAuth,
  handleErrorAsync(async (req, res, next) =>
    UsersController.updatePassword(req, res, next)
  )
);
// GET：{url}/users/profile: 取得個人資料，需設計 isAuth middleware。
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
  "/users/profile",
  auth.isAuth,
  handleErrorAsync(async (req, res, next) =>
    UsersController.getProfile(req, res, next)
  )
);
// PATCH：{url}/users/profile: 更新個人資料，需設計 isAuth middleware
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
                "$name": 'Jhon DoeC',
                "$photo": 'https://carolchyang.github.io/nodeFinal/img/login.e25e826d.png'
            }
        }
     */
  "/users/profile",
  auth.isAuth,
  handleErrorAsync(async (req, res, next) =>
    UsersController.updateProfile(req, res, next)
  )
);

router.get(
  "/users/:id/likes",
  handleErrorAsync(async (req, res, next) =>
    /*#swagger.tags = ['Users']
      #swagger.description = '取得使用者的按讚列表'
      #swagger.method = 'GET'
      #swagger.responses[200] = {
        schema: {
          "_id": "628dea31b5315cd52aff7305",
          "user": {
            "_id": "6283924bddb475c3f2c6d2f9",
            "name": "test2",
            "email": "test2@gmail.com",
            "photo": ""
          },
          "post": {
            "_id": "6289d155d555b60de6179f9b",
            "createAt": "2022-05-22T05:59:49.518Z"
          }
        }
      }
    */
    UsersController.getlikeList(req, res, next)
  )
);

//測試用
router.delete(
  /*
    #swagger.ignore = true
   */
  "/users/:id",
  handleErrorAsync(async (req, res, next) =>
    UsersController.delUser(req, res, next)
  )
);
//測試用
router.get(
  /*#swagger.tags = ['Users']
    #swagger.description = 'Endpoint to get All Users(測試用)'
    #swagger.path = '/users'
    #swagger.method = 'GET'
    #swagger.responses[200] = { description: 'Some description...' }
   */
  "/users",
  handleErrorAsync(async (req, res, next) =>
    UsersController.getAllUsers(req, res, next)
  )
);
//測試用
router.get(
  /* #swagger.tags = ['Users']
     #swagger.description = '取得個人資料(測試用)'
      #swagger.path = '/users/{email}'
      #swagger.method = 'GET'
      #swagger.produces = ["application/json"]
  */
  "/users/:id",
  handleErrorAsync(async (req, res, next) =>
    UsersController.getUser(req, res, next)
  )
);
//測試用
router.delete(
  /* 
  #swagger.tags = ['Users']
  #swagger.description = 'DELETE所有資料(測試用)'
  #swagger.path = '/users'
  #swagger.method = 'DELETE'
  */
  "/users",
  handleErrorAsync(async (req, res, next) =>
    UsersController.delAllUsers(req, res, next)
  )
);

module.exports = router;
