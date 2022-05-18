var express = require('express');
const { json } = require('express/lib/response');
var router = express.Router();
var article =require('.././models/newArticlePost');
const { isAuth } = require('../middleware/auth');
//var article =require('.././models/Article');
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

    await article.create({
        "content":req.body.content,
        "userId":userId,
        "imageId": imageId
    });

    res.send('新增成功!');
})

//檢測用
router.get('/',async function(req,res){      
   let result = await article.find();

    res.send(result);
})

/**
 * 刪除貼文
 */
router.delete('/:postId',async function(req,res){
    if(!req.params.postId){
        throw new Error("請填寫要刪除的貼文")
    }
    let postId = req.params.postId;
    
    await article.findOneAndUpdate(
    postId      
    ,{
        "isActive":false
    })

    res.send('刪除成功')
} )

module.exports = router;