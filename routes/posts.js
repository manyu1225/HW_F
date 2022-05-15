const express = require("express");
const router = express.Router();
const PostsController = require("../controller/posts");
const handleErrorAsync = require("../service/handleErrorAsync");
router.get(
  /* 
    #swagger.tags = ['Posts']
    #swagger.description = 'Endpoint to get All Posts'
    #swagger.path = '/posts'
    #swagger.method = 'GET'
    #swagger.produces = ["application/json"]
  */
  "/",
  handleErrorAsync(async (req, res, next) =>
    PostsController.getPostsbyContent(req, res, next)
  )
);
router.get(
  /* 
#swagger.tags = ['Posts']
#swagger.description = 'Endpoint get Posts in a specific user'
 #swagger.path = '/posts/{id}'
#swagger.method = 'GET'
  #swagger.produces = ["application/json"]
*/
  "/:id",
  handleErrorAsync(async (req, res, next) =>
    PostsController.getPosts(req, res, next)
  )
);
router.post(
  /*
#swagger.tags = ['Posts']
#swagger.description = Endpoint create Posts'
#swagger.path = '/posts'
#swagger.method = 'POST'
#swagger.produces = ["application/json"]
#swagger.parameters['body'] = {
  in: 'body',
  type :"object",
  required:true,
  description: "資料格式",
  schema: {
          "$name": 'Jhon Doe',
          "$tags": 'AAA',
          "$type":  'group',
          "$content":'XXX'
      }
  }
*/

  "/",
  handleErrorAsync(async (req, res, next) =>
    PostsController.createPosts(req, res, next)
  )
);
router.patch(
  /*
#swagger.tags = ['Posts']
#swagger.description = 'Endpoint to update Posts'
#swagger.path = '/posts/{id}'
#swagger.method = 'PATCH'
#swagger.produces = ["application/json"]
#swagger.parameters['body'] = {
 in: 'body',
 type :"object",
 required:true,
 description: "資料格式",
 schema: {
         "$name": 'Jhon DoeB',
         "$tags": 'BBB',
         "$type":  'group',
         "$content":'XXXB'
     }
 }
*/
  "/:id",
  handleErrorAsync(async (req, res, next) =>
    PostsController.updPosts(req, res, next)
  )
);
router.delete(
  /*
#swagger.tags = ['Posts']
 #swagger.description = 'Endpoint to delete Posts '
#swagger.path = '/posts/{id}'
 #swagger.method = 'DELETE'
 #swagger.produces = ["application/json"]
 #swagger.security = [{
         "apiKeyAuth": []
  }]
*/
  "/:id",
  handleErrorAsync(async (req, res, next) =>
    PostsController.delPosts(req, res, next)
  )
);
router.delete(
  /*
    #swagger.ignore = true
   */
  "/",
  handleErrorAsync(async (req, res, next) =>
    PostsController.delAllPosts(req, res, next)
  )
);

module.exports = router;
