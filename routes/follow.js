var express = require("express");
var router = express.Router();
const { isAuth } = require("../middleware/auth");
var followController =require('../controller/follow');

router
  .route("/")
  .get([isAuth,followController.getAll])           // 取得追蹤清單
  .post([isAuth, followController.createFollow]);    // 新增追蹤

router.route("/:followId").delete([isAuth, followController.deleteFollow]);  // 取消追蹤
module.exports = router;
