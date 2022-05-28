const express = require("express");
const router = express.Router();
const { isAuth } = require("../middleware/auth");
const articleController = require("../controller/article");

router
  .route("/")
  .get([articleController.getAll]) // 檢測用
  .post([isAuth, articleController.createPosts]); // 新增貼文

// 刪除貼文
router.route("/:postId").delete([isAuth, articleController.deletePosts]);

router
  .route("/:id/likes")
  .get([isAuth, articleController.likePost]) // 按讚
  .delete([isAuth, articleController.unlikePost]); // 退讚

module.exports = router;
