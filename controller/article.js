const Article = require("../models/ArticlePost");
const Likes = require("../models/Likes");
const appError = require("../service/appError");
const httpStatus = require("../utils/httpStatus");
const handleSuccess = require("../service/handleSuccess");
const handleErrorAsync = require("../service/handleErrorAsync");

const articleController = {
  async getAll(req, res, next) {
    handleErrorAsync(async (req, res, next) => {
      /*  #swagger.tags = ['Posts']
          #swagger.params="撈所有貼文"
          #swagger.description = '撈所有貼文'
          #swagger.method = 'GET'
          #swagger.produces = ["application/json"]
          #swagger.security = [{ "Bearer": [] }]
          #swagger.parameters['body'] = {
            in: 'body',
            type :"object",
            required:true,
            schema: {
                  "pageCount":10,
                  "page":1,
                  "sort":1,
                  "reverse":true,
                  "$userId":'指定要查的使用者',
                  "$content":'搜尋貼文內容(模糊搜尋)',
                }
            }
      */
      let pageCount = req.body.pageCount || 10; //預設為10筆
      let page = (req.body.page || 1 )-1; //頁數最小為0頁，但閱讀不易所以改成第1頁為開始
      let startIndex=  pageCount*page;
      let keyWord = req.body.content;
      let searchMode = {}
      let sort = (req.body.sort|| "createAt")
      if (keyWord) {
        searchMode={
          content:{$regex:new RegExp(keyWord,'i')}
        }
      }
      let result = await Article.find(searchMode)
      .skip(startIndex)
      .limit(pageCount);
      

      handleSuccess(res, httpStatus.OK, result);
    })(req, res, next);
  },
  async createPosts(req, res, next) {
    handleErrorAsync(async (req, res, next) => {
      /*  #swagger.tags = ['Posts']
          #swagger.params="建立貼文"
          #swagger.description = '建立貼文'
          #swagger.method = 'POST'
          #swagger.produces = ["application/json"]
          #swagger.security = [{ "Bearer": [] }]
          #swagger.parameters['body'] = {
            in: 'body',
            type :"object",
            required:true,
            schema: {
                  "$userId":'someone id',
                  "$content":'我是廢文 我是廢文 我是廢文 我是廢文',
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
