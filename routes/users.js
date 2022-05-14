const express = require("express");
const router = express.Router();
const UsersController = require("../controller/users");
const handleErrorAsync = require("../service/handleErrorAsync");
/**
 * #swagger.tags = ['Users']
 */
router.get(
  /*
      #swagger.tags = ['Users']
      #swagger.description = 'Endpoint to get All Users'
      #swagger.path = '/users'
      #swagger.method = 'GET'
      #swagger.produces = ["application/json"]
      #swagger.responses[200] = { description: 'Some description...' }
     */
  "/",
  handleErrorAsync(async (req, res, next) =>
    UsersController.getAllUsers(req, res, next)
  )
);
router.get(
  "/:id",
  /*
      #swagger.tags = ['Users']
      #swagger.description = '取得 User 資訊'
      #swagger.path = '/users/{email}'
      #swagger.method = 'GET'
      #swagger.produces = ["application/json"]
      #swagger.responses[400]
     */
  handleErrorAsync(async (req, res, next) =>
    UsersController.getUser(req, res, next)
  )
);

router.post(
  /*
      #swagger.tags = ['Users']
      #swagger.description = ' User註冊'
      #swagger.path = '/users/register'
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
            }
        }
     */
  "/register",
  handleErrorAsync(async (req, res, next) =>
    UsersController.createUser(req, res, next)
  )
);
router.patch(
  /*
      #swagger.tags = ['Users']
      #swagger.description = '更新User'
      #swagger.path = '/users/{mail}'
      #swagger.method = 'PATCH'
      #swagger.produces = ["application/json"]
      #swagger.parameters['body'] = {
        in: 'body',
        type :"object",
        required:true,
        description: "資料格式",
        schema: {
                "$name": 'Jhon DoeB',
                "$photo": 'BBB'
            }
        }
     */
  "/:id",
  handleErrorAsync(async (req, res, next) =>
    UsersController.updUser(req, res, next)
  )
);
router.delete(
  /*
      #swagger.tags = ['Users']
      #swagger.description = 'DELETE User'
      #swagger.path = '/users/{id}'
      #swagger.method = 'DELETE'
      #swagger.produces = ["application/json"]
      #swagger.security = [{
               "apiKeyAuth": []
        }]
     */
  "/:id",
  handleErrorAsync(async (req, res, next) =>
    UsersController.delUser(req, res, next)
  )
);
/*
router.delete(
 
     #swagger.tags = ['Users']
     #swagger.description = 'EDELETE All Users'
     #swagger.path = '/users'
     #swagger.method = 'DELETE'
     #swagger.produces = ["application/json"]
    
  "/",
  handleErrorAsync(async (req, res, next) =>
    UsersController.delAllUsers(req, res, next)
  )
);
*/

module.exports = router;
