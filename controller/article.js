const Article = require("../models/ArticlePost");
const Likes = require("../models/Likes");
const appError = require("../service/appError");
const httpStatus = require("../utils/httpStatus");
const handleSuccess = require("../service/handleSuccess");
const handleErrorAsync = require("../service/handleErrorAsync");
const { aggregate } = require("../models/ArticlePost");

const articleController = {
  async getAll(req, res, next) {
    handleErrorAsync(async (req, res, next) => {
      /*  #swagger.tags = ['Posts']
          #swagger.summary="撈貼文(有給userId為指定人物貼文列) *熱門貼文排序還在修正中* "
          #swagger.description = '撈貼文(有給userId為指定人物貼文列) *熱門貼文排序還在修正中*'
          #swagger.method = 'GET'
          #swagger.produces = ["application/json"]
          #swagger.parameters['body'] = {
            in: 'body',
            type :"object",
            required:true,
            schema: {
                  "pageCount":"每頁筆數 (required,預設10筆,number)", 
                  "page":"目前第幾頁(required,最小為 1,number) ", 
                  "sort":"排序類型(required, [ 1 發文時間、 2 按讚數(熱門) ],number)", 
                  "reverse":"排序順反向(required, [true順向(大到小、新到舊)、false(反向、與前者相反)],boolean) ", 
                  "postId":"指定貼文Id",
                  "$userId":'指定要查的使用者',
                  "$content":'搜尋貼文內容(模糊搜尋)',
                }
            }
      */
      let pageCount = req.body.pageCount || 10; //預設為10筆
      let page = (req.body.page || 1 )-1; //頁數最小為0頁，但閱讀不易所以改成第1頁為開始
      let startIndex=  pageCount*page;
      let keyWord = req.body.content;
      let userId=req.body.userId;
      
      let searchMode = {
        isActive:true
      }
      let reverse = req.body.reverse ?  1 : -1;
      let sort = {"createAt":reverse};
      let postId =req.body.postId ||"";

      if (req.body.sort == 2) {
         sort = {"likeCount":reverse};
      }
      if (keyWord) {
        searchMode.content={$regex:new RegExp(keyWord,'i')};
      }

      if(postId){
        searchMode._id=postId;
      }

      if(userId){
        searchMode.userId=userId;
      }
      let result = await Article
      .find(searchMode)      
      .populate({
        path: "userId",
        select: "_id name photo",
      })
      .populate({
        path:"likeCount",
        select:" likeCount "
      })
      .sort(sort)
      .skip(startIndex)
      .limit(pageCount);

      let dataCounts = await Article.countDocuments({});
      let totalPages = Math.floor(dataCounts/pageCount,0)+1
      result = {
        pagination:{
          "current_pages":page+1,
          "total_pages":totalPages,
          "total_datas":dataCounts
        },
        data:result
      }
      handleSuccess(res, httpStatus.OK, result);
    })(req, res, next);
  },
  async createPosts(req, res, next) {
    handleErrorAsync(async (req, res, next) => {
      /*  #swagger.tags = ['Posts']
          #swagger.summary="建立貼文"
          #swagger.description = '建立貼文'
          #swagger.method = 'POST'
          #swagger.produces = ["application/json"]
          #swagger.security = [{ "Bearer": [] }]
          #swagger.parameters['body'] = {
            in: 'body',
            type :"object",
            required:true,
            schema: {
                  "$content":'文章內容',
                  "$imageId":'photo.jpg',
                }
            }
      */

      if (!req.body.content && !req.body.imageId) {
        return appError(
          httpStatus.BAD_REQUES,
          "貼文內容或圖片內容必擇一填寫!",
          next
        );
      }

      //預設讀取登入者資料
      let userId = req.user._id;
      if (!userId) {
        return appError(httpStatus.BAD_REQUES, "請先登入在填寫!", next);
      }

      let imageId = req.body.imageId;
      if (!imageId) {
        imageId = "";
      }

      const newUser = await Article.create({
        content: req.body.content,
        userId: userId,
        imageId: imageId,
      });

      handleSuccess(res, httpStatus.CREATED, newUser);
    })(req, res, next);
  },
  async deletePosts(req, res, next) {
    handleErrorAsync(async (req, res, next) => {
      /*  #swagger.tags = ['Posts']
          #swagger.summary='刪除貼文'
          #swagger.description = '刪除貼文'
          #swagger.method = 'DELETE'
          #swagger.produces = ["application/json"]
          #swagger.security = [{ "Bearer": [] }]
      */
      const postId = req.params.postId;

      if (!postId) {
        return appError(httpStatus.BAD_REQUES, "請填寫要刪除的貼文!", next);
      }

      const data = await Article.findById(postId);
      if (!data) {
        return appError(httpStatus.BAD_REQUEST, "無該ID", next);
      }

      await Article.findOneAndUpdate(postId, {
        isActive: false,
      });

      handleSuccess(res, httpStatus.OK, data);
    })(req, res, next);
  },
  async likePost(req, res, next) {
    handleErrorAsync(async (req, res, next) => {
      /*  #swagger.tags = ['Posts']
          #swagger.description = '登入者按讚'
          #swagger.produces = ["application/json"]
          #swagger.security = [{ "Bearer": [] }]
          #swagger.responses[201] = {
            schema: {
              "_id": 'new ObjectId("628dded3d331624c57a77e8d")',
              "user": 'new ObjectId("62838f86ddb475c3f2c6d2ef")',
              "post": 'new ObjectId("628909974247c44568d85428")',
            }
          }
      */
      const postId = req.params.id;

      const foundLike = await Likes.findOne({
        user: req.user._id,
        post: postId,
      });

      if (foundLike) {
        return appError(httpStatus.BAD_REQUES, "已經按過讚", next);
      }

      const newLike = await Likes.create({
        user: req.user._id,
        post: postId,
      });
      handleSuccess(res, httpStatus.CREATED, newLike);
    })(req, res, next);
  },
  async unlikePost(req, res, next) {
    handleErrorAsync(async (req, res, next) => {
      /*  #swagger.tags = ['Posts']
          #swagger.description = '登入者退讚'
          #swagger.produces = ["application/json"]
          #swagger.security = [{ "Bearer": [] }]
          #swagger.responses[200] = {
            schema: {
              "status": "success",
              "data": {
                "_id": 'new ObjectId("628dded3d331624c57a77e8d")',
                "user": 'new ObjectId("62838f86ddb475c3f2c6d2ef")',
                "post": 'new ObjectId("628909974247c44568d85428")',
                "createAt": "2022-05-25T09:01:36.143Z"
              }
            }
          }
      */
      const deletedLike = await Likes.findOneAndDelete({
        user: req.user._id,
        post: req.params.id,
      });

      if (!deletedLike) {
        return appError(httpStatus.BAD_REQUES, "沒有按讚紀錄", next);
      }

      handleSuccess(res, httpStatus.OK, deletedLike);
    })(req, res, next);
  },
};

module.exports = articleController;
