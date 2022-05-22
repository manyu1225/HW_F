const Article = require("../models/ArticlePost");
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
          #swagger.method = 'GET'
          #swagger.produces = ["application/json"]
          #swagger.security = [{ "Bearer": [] }]
      */
      const postId = req.params.id;

      if (!postId) {
        return appError(httpStatus.BAD_REQUEST, "請填寫要刪除的貼文!", next);
      }
      console.log("postId :>> ", postId);

      const updatedArticle = await Article.findByIdAndUpdate(
        postId,
        {
          $addToSet: { likes: req.user._id },
        },
        { new: true }
      );
      console.log("updatedArticle :>> ", updatedArticle);

      if (!updatedArticle) {
        return appError(httpStatus.BAD_REQUEST, "查無貼文!", next);
      }

      handleSuccess(res, httpStatus.NO_CONTENT, null);
    })(req, res, next);
  },
  async unlikePost(req, res, next) {
    handleErrorAsync(async (req, res, next) => {
      /*  #swagger.tags = ['Posts']
          #swagger.description = '登入者退讚'
          #swagger.method = 'GET'
          #swagger.produces = ["application/json"]
          #swagger.security = [{ "Bearer": [] }]
      */
      const postId = req.params.id;

      if (!postId) {
        return appError(httpStatus.BAD_REQUEST, "請填寫要刪除的貼文!", next);
      }

      const updatedArticle = await Article.findOneAndUpdate(
        postId,
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );

      if (!updatedArticle) {
        return appError(httpStatus.BAD_REQUEST, "查無貼文!", next);
      }

      handleSuccess(res, httpStatus.NO_CONTENT, null);
    })(req, res, next);
  },
};

module.exports = articleController;
