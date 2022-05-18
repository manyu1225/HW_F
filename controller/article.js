var article =require('../models/ArticlePost');
const appError = require("../service/appError");
const httpStatus = require("../utils/httpStatus");
const handleSuccess = require("../service/handleSuccess");

const articleController ={
    async getAll(req,res,nex){
        let result = await article.find();
        handleSuccess(res, httpStatus.OK, result);
    },
    async createPosts(req, res, next) {
        if (! req.body.content) {
            return appError(httpStatus.BAD_REQUES, "貼文內容為必填!", next);
        }
        //預設讀取登入者資料
        let userId ="0";
        if(! userId){
            return appError(httpStatus.BAD_REQUES, "請先登入在填寫!", next);
        }
    
        let imageId =req.body.imageId
        if (! imageId) {
            imageId = "";
        }
    
        const newUser = await article.create({
            "content":req.body.content,
            "userId":userId,
            "imageId": imageId
        });
    
        handleSuccess(res, httpStatus.OK, newUser);
    },
    async deletePosts(req, res, next) {

        const postId =req.params.postId;

        if(!postId){
            return appError(httpStatus.BAD_REQUES, "請填寫要刪除的貼文!", next);
        }

        const data = await article.findById()
        if (!data) {
            return appError(httpStatus.BAD_REQUEST, "無該ID", next);
        }
        
        await article.findOneAndUpdate(
        postId      
        ,{
            "isActive":false
        })
    
        handleSuccess(res, httpStatus.OK, data);
    }
}

module.exports =articleController