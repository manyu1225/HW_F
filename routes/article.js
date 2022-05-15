var express = require('express');
const { json } = require('express/lib/response');
var router = express.Router();
var newPost =require('.././models/newArticlePost');

/**
 * 新增貼文
 */
router.post('/',async function(req,res){      
    if (! req.body.content) {
        throw  new Error("貼文內容為必填!");
    }
    //預設讀取登入者資料
    let userId ="0";
    if(! userId){
        throw new Error("請先登入在填寫!"); 
    }

    let imageId =req.body.imageId
    if (! imageId) {
        imageId = "";
    }

    await newPost.create({
        "content":req.body.content,
        "userId":userId,
        "imageId": imageId
    });

    res.send('新增成功!');
})

module.exports = router;