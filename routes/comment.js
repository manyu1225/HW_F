const express = require("express");
const router = express.Router();
const CommentController = require("../controller/comment");
const handleErrorAsync = require("../service/handleErrorAsync");
const auth = require("../middleware/auth");

router.get(
  /*  #swagger.tags = ['Comments']
      #swagger.description = '查詢回覆'
      #swagger.path = '/comments'
      #swagger.method = 'GET'
      #swagger.security = [{
         "Bearer": []
     }]
   */
  "/",
  auth.isAuth,
  handleErrorAsync(async (req, res, next) =>
    CommentController.getComment(req, res, next)
  )
);

router.post(
  /*  #swagger.tags = ['Comments']
      #swagger.description = '新增回覆'
        <ul>
          <li>先取 Token Bearer</li>
          <li>新增回覆請提供 postId </li>
        </ul>
      #swagger.path = '/comments'
      #swagger.method = 'POST'
      #swagger.produces = ["application/json"]
      #swagger.parameters['body'] = {
        in: 'body',
        type:"object",
        required: true,
        description: "資料格式",
        schema: {
                "$content": 'XXXXXXXXXXXXXXXXXXXXXXXxxx',
                "$postId": '62932decf5ca8d7e2a82bcaf'
            }
        }
         #swagger.security = [{
         "Bearer": []
     }]
   */
  "/",
  auth.isAuth,
  handleErrorAsync(async (req, res, next) =>
    CommentController.createComment(req, res, next)
  )
);
router.delete(
  /*  #swagger.tags = ['Comments']
      #swagger.description = '刪除回覆'
      #swagger.path = '/comments/{id}'
      #swagger.method = 'DELETE'
      #swagger.produces = ["application/json"]
      #swagger.security = [{
         "Bearer": []
     }]
   */
  "/:id",
  auth.isAuth,
  handleErrorAsync(async (req, res, next) =>
    CommentController.deleteComments(req, res, next)
  )
);
module.exports = router;
