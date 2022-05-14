const handleErrorAsync = require("../service/handleErrorAsync");
const appError = require("../service/appError");
const httpStatus = require("../utils/httpStatus");
const handleSuccess = require("../service/handleSuccess");
const usersModel = require("../models/User");

const usersController = {
  async getAllUsers(req, res, next) {
    const timeSort = req.query.timeSort === "asc" ? "createdAt" : "-createdAt";
    const limit = req.query.limit;
    const all = await usersModel.find().sort(timeSort).limit(limit);
    handleSuccess(res, httpStatus.OK, all);
  },
  async getUser(req, res, next) {
    const email = req.params.id;
    const data = await usersModel.find({ email: email });
    if (!data.length) {
      return appError(httpStatus.BAD_REQUES, "email 不存在", next);
    }
    handleSuccess(res, httpStatus.OK, data);
  },
  async createUser(req, res, next) {
    const data = req.body;
    let { name, email } = data; //解構
    if (!name || !email) {
      return appError(httpStatus.BAD_REQUEST, "請確認欄位", next);
    } else {
      const newUser = await usersModel.create({ name, email });
      handleSuccess(res, httpStatus.OK, newUser);
    }
  },
  async updUser(req, res, next) {
    const email = req.params.id;
    const data = req.body;
    if (!email) {
      return appError(httpStatus.BAD_REQUEST, "email不可為空", next);
    }
    if (!data.name) {
      return appError(httpStatus.BAD_REQUEST, "name不可為空", next);
    }
    const updPost = await usersModel.findOneAndUpdate(email, data, {
      new: true,
      runValidators: true,
    });
    if (!updPost) {
      return appError(httpStatus.BAD_REQUEST, "無此email", next);
    } else {
      handleSuccess(res, httpStatus.OK, updPost);
    }
  },
  async delUser(req, res, next) {
    const email = req.params.id;
    const originalUrl = req.originalUrl;

    if (!email || !originalUrl) {
      return appError(httpStatus.BAD_REQUEST, "參數有缺", next);
    }
    const user = await usersModel.find({ email: email });
    console.log("99 user.length =" + user);
    if (!user.length) {
      return appError(httpStatus.BAD_REQUEST, "無此email", next);
    }
    const data = await usersModel.findByIdAndDelete(user);
    handleSuccess(res, httpStatus.OK, data);
  },

  async delAllUsers(req, res, next) {
    return appError(httpStatus.BAD_REQUEST, "參數有缺", next);
    // await usersModel.deleteMany({});
    // handleSuccess(res, httpStatus.OK, []);
  },
};
module.exports = usersController;
