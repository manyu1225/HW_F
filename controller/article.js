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
          #swagger.description = '撈所有貼文'
          #swagger.method = 'GET'
          #swagger.produces = ["application/json"]
          #swagger.security = [{ "Bearer": [] }]
      */
      let result = await Article.find();
      handleSuccess(res, httpStatus.OK, result);
    })(req, res, next);
  },
  async createPosts(req, res, next) {
    handleErrorAsync(async (req, res, next) => {
      /*  #swagger.tags = ['Posts']
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

      if (!req.body.content) {
        return appError(httpStatus.BAD_REQUES, "貼文內容為必填!", next);
      }
      //預設讀取登入者資料
      let userId = "0";
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

      const data = await Article.findById();
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
        handleSuccess(res, httpStatus.NO_CONTENT, null);
      } else {
        const newLike = await Likes.create({
          user: req.user._id,
          post: postId,
        });
        handleSuccess(res, httpStatus.CREATED, newLike);
      }
    })(req, res, next);
  },
  async unlikePost(req, res, next) {
    handleErrorAsync(async (req, res, next) => {
      /*  #swagger.tags = ['Posts']
          #swagger.description = '登入者退讚'
          #swagger.produces = ["application/json"]
          #swagger.security = [{ "Bearer": [] }]
          #swagger.responses[201] = {
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

      if (deletedLike) {
        handleSuccess(res, httpStatus.OK, deletedLike);
      } else {
        handleSuccess(res, httpStatus.NO_CONTENT, null);
      }
    })(req, res, next);
  },
};

module.exports = articleController;
