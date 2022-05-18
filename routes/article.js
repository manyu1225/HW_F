var express = require('express');
const { json } = require('express/lib/response');
var router = express.Router();
var article =require('../models/ArticlePost');
const { isAuth } = require('../middleware/auth');
const articleController = require('../controller/article')
const handleErrorAsync = require("../service/handleErrorAsync");

/**
 * 新增貼文
 */
router.post(
    '/',
    isAuth,
    handleErrorAsync(async (req,res,next)=> 
    articleController.createPosts(req,res,next))
)

//檢測用
router.get(
    '/',
    handleErrorAsync( async (req,res,next)=>
    articleController.getAll(req,res,next)
))

/**
 * 刪除貼文
 */
router.delete(
    '/:postId',
    isAuth,
    handleErrorAsync( async(req,res,next)=>
    articleController.deletePosts(req,res,next))
)

module.exports = router;