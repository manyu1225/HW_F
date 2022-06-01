const express = require("express");
const router = express.Router();
const { isAuth } = require("../middleware/auth");
const articleController = require("../controller/article");
let multer = require('multer');
const { uploadImage, handleUploadImageError } = require('../service/uploadImage');
const imagMaxSize = 1;
let upload = multer();

router
  .route("/")
  .get([articleController.getAll]) 
  .post([isAuth,upload.fields([{ name: 'img', maxCount: 1 }, { name: 'content', maxCount: 1 }]), articleController.createPosts]); // 新增貼文


// 刪除貼文
router.route("/:postId").delete([isAuth, articleController.deletePosts]);

router
  .route("/:id/likes")
  .get([isAuth, articleController.likePost]) // 按讚
  .delete([isAuth, articleController.unlikePost]); // 退讚

module.exports = router;
