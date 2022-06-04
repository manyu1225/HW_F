const express = require("express");
const router = express.Router();
const UsersController = require("../controller/users");
const handleErrorAsync = require("../service/handleErrorAsync");
const auth = require("../middleware/auth");
const checkAvatar = require("../middleware/checkAvatar");

router.post(
  /*  #swagger.tags = ['Users']
      #swagger.description = '註冊'
      #swagger.path = '/users/sign_up'
      #swagger.method = 'POST'
      #swagger.produces = ["application/json"]
      #swagger.parameters['body'] = {
        in: 'body',
        type:"object",
        required: true,
        description: "資料格式",
        schema: {
                "$name": 'HELLOYO',
                "$email":'test@gmail.com',
                "$password":'a12345678',
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
  "/sign_in",
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
      description: "密碼需至少 8 碼以上，並數字與英文或符號混合",
      schema: {
              "$password":'password123',
              "$passwordConfirm":'password123',
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
// GET：{url}/profile: 取得個人資料，需設計 isAuth middleware。
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
// PATCH：{url}/users/profile: 更新個人資料，需設計 isAuth middleware
router.post(
  /*  #swagger.tags = ['Users']
      #swagger.description = '更新個人資料'
      #swagger.path = '/users/profile'
      #swagger.method = 'PATCH'
      #swagger.produces = ["application/json"]
      #swagger.security = [{
         "Bearer": []
      }]
      #swagger.parameters['formData'] = [
        {
          in: 'formData',
          name:'photo',
          type :'file',
          description:'圖片'
        },
        {
          in: 'formData',
          name:'name',
          type :'string',
          description:'使用者名稱'
        },
        {
          in: 'formData',
          name:'gender',
          type :'string',
          description:'使者性別：unknown, male, female'
        }
      ]
     */
  "/profile",
  auth.isAuth,
  checkAvatar,
  handleErrorAsync(async (req, res, next) =>
    UsersController.updateProfile(req, res, next)
  )
);

router.get(
  /*#swagger.tags = ['Users']
      #swagger.description = '取得使用者的按讚列表'
      #swagger.method = 'GET'
      #swagger.responses[200] = {
        schema: {
          "status": "success",
          "data": {
            "pagination": {
                "current_pages": 1,
                "total_pages": 3,
                "total_datas": 3
            },
            "likes": [
              {
                "_id": "628de9fcb5315cd52aff72fe",
                "user": {
                  "_id": "628dded3d331624c57a77e8d",
                  "name": "Jack",
                  "email": "test@gmail.com",
                  "photo": "someImage.jpg"
                },
                "post": {
                  "_id": "6289d155d555b60de6179f9b",
                  "content": "content content",
                  "userId": {
                    "_id": "62838f86ddb475c3f2c6d2ef",
                    "name": "Tom",
                    "email": "tommy@gmail.com",
                    "photo": "photo.png"
                  },
                  "createAt": "2022-05-22T05:59:49.518Z",
                  "id": "6289d155d555b60de6179f9b"
                }
              }
            ]
          }
        }
      }
    */
  "/:id/likes",
  handleErrorAsync(async (req, res, next) =>
    UsersController.getlikeList(req, res, next)
  )
);

//測試用
router.delete(
  /*
    #swagger.ignore = true
   */
  "/:id",
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
  */
  "/",
  handleErrorAsync(async (req, res, next) =>
    UsersController.getAllUsers(req, res, next)
  )
);
//測試用
router.get(
  /*#swagger.tags = ['Users']
    #swagger.description = '取得個人資料'
    #swagger.produces = ["application/json"]
    #swagger.responses[200] = {
      schema: {
        "status": "success",
        "data": {
          "user": {
              "_id": "62838f86ddb475c3f2c6d2ef",
              "name": "someone",
              "email": "someone@gmail.com",
              "photo": "someImage",
              "updatedAt": "2022-05-28T04:21:57.051Z",
              "gender": "female"
          },
          "followerCount": 0
        }
      }
    }
  */
  "/:id",
  auth.isAuth,
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
  "/",
  handleErrorAsync(async (req, res, next) =>
    UsersController.delAllUsers(req, res, next)
  )
);

module.exports = router;
