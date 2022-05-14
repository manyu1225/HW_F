const handleErrorAsync = require("../service/handleErrorAsync");
const appError = require("../service/appError");
const httpStatus = require("../utils/httpStatus");
const handleSuccess = require("../service/handleSuccess");
const postsModel = require("../models/Post");
const postsController = {
  async getPostsbyContent(req, res, next) {
    const timeSort = req.query.s === "asc" ? "createdAt" : "-createdAt";
    // const limit = req.query.limit;
    const q =
      req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
    const data = await postsModel
      .find(q)
      .populate({ path: "user", select: "name photo" })
      .sort(timeSort);
    // const all = await postsModel.find().sort(timeSort).limit(limit);
    handleSuccess(res, httpStatus.OK, data);
  },
  async getPosts(req, res, next) {
    const id = req.params.id;
    // const data = await postsModel.find({ _id: id });
    const data = await postsModel.findById(id).populate({
      path: "user",
      select: "name photo",
    });
    if (!data) {
      return appError(httpStatus.BAD_REQUES, "id 不存在", next);
    }
    handleSuccess(res, httpStatus.OK, data);
  },
  async createPosts(req, res, next) {
    const data = req.body;
    let { name, tags, type, content } = data; //解構
    if (!name || !type || !tags || !content) {
      return appError(httpStatus.BAD_REQUEST, "請確認欄位", next);
    } else {
      const newUser = await postsModel.create(data);
      handleSuccess(res, httpStatus.OK, newUser);
    }
  },
  async updPosts(req, res, next) {
    const id = req.params.id;
    const data = req.body;
    if (!data) {
      return appError(httpStatus.BAD_REQUEST, "不可為空物件", next);
    }
    const updPost = await postsModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updPost) {
      return appError(httpStatus.BAD_REQUEST, "無此ID", next);
    } else {
      handleSuccess(res, httpStatus.OK, updPost);
    }
  },
  async delPosts(req, res, next) {
    const id = req.params.id;
    const data = await postsModel.findByIdAndDelete(id);
    if (!data) {
      return appError(httpStatus.BAD_REQUEST, "無該ID", next);
    }

    handleSuccess(res, httpStatus.OK, data);
  },

  async delAllPosts(req, res, next) {
    // await postsModel.deleteMany({});
    return appError(httpStatus.BAD_REQUEST, "參數有缺", next);
    // handleSuccess(res, httpStatus.OK, []);
  },
};
module.exports = postsController;
