var express = require("express");
var router = express.Router();
const PostsController = require("../controller/posts");

router.get("/", PostsController.getAllPosts);
router.get("/:id", PostsController.getPosts);
router.post("/", PostsController.createPosts);
router.patch("/:id", PostsController.updPosts);
router.delete("/:id", PostsController.delPosts);
router.delete("/", PostsController.delAllPosts);

module.exports = router;
