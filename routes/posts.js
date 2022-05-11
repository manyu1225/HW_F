var express = require('express');
var router = express.Router();
const PostsController = require('../controller/posts.js');

router.get('/', PostsController.getPosts);
router.get('/', PostsController.createPosts);
router.get('/:id', PostsController.delPosts);
router.get('/', PostsController.delAllPosts);
router.get('/:id', PostsController.updPosts);
router.get('/', PostsController.getAllPosts);
module.exports = router;
