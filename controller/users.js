const usersModel = require("../models/User");
const httpStatus = require("../utils/httpStatus");
const handleSuccess = require("../service/handleSuccess");
const handleErrorAsync = require("../service/handleErrorAsync");
const appError = require("../service/appError");
const bcrypt = require("bcrypt"); //處理密碼，獲得 hashed password
const jwt = require("jsonwebtoken"); //JWT 產生與驗證

const usersController = {
  async register(req, res, next) {
    const data = req.body;
    let { name, email, password } = data; //解構
    if (!name || !email || !password) {
      return appError(httpStatus.BAD_REQUEST, "請確認欄位", next);
    }
    const user = await usersModel.findOne({ email });
    if (user) {
      return appError(httpStatus.BAD_REQUEST, "Mail已被註冊！", next);
    }
    const psd = await bcrypt.hash(password, 8);
    const newUser = await usersModel.create({
      name,
      email,
      password: psd,
    });
    // 產生 JWT token =>SSO
    newUser.token = jwt.sign(
      { id: newUser._id, name: newUser.name },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_DAY,
      }
    );
    handleSuccess(res, httpStatus.OK, {
      id: newUser._id,
      name: newUser.name,
      photo: newUser.photo,
      token: newUser.token,
    });
  },
  async signin(req, res, next) {
    const data = req.body;
    let { email, password } = data; //解構
    if (!email || !password) {
      return appError(httpStatus.BAD_REQUEST, "請確認欄位", next);
    }
    const user = await usersModel.findOne({ email }).select("+password");
    if (!user) {
      return appError(httpStatus.BAD_REQUEST, "帳號或密碼有誤！", next);
    }
    const isValidated = await bcrypt.compare(password, user.password);
    if (!isValidated) {
      return appError(httpStatus.BAD_REQUEST, "密碼錯誤！", next);
    }
    // 產生 JWT token =>SSO
    user.token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_DAY,
      }
    );
    handleSuccess(res, httpStatus.OK, {
      id: user._id,
      name: user.name,
      photo: user.photo,
      token: user.token,
    });
  },
  //從 Middleware 之 JWT 取得 User 資訊
  async updatePassword(req, res, next) {
    const data = req.body;
    const userId = req.user?._id;
    let { password } = data; //解構
    if (!password) {
      return appError(httpStatus.BAD_REQUEST, "password不可為空", next);
    }
    const psd = await bcrypt.hash(password, 8);
    const updpsd = await usersModel.updateOne(
      { _id: userId },
      { $set: { password: psd } }
    );
    if (!updpsd) {
      return appError(httpStatus.BAD_REQUEST, "更新失敗！", next);
    }
    handleSuccess(res, httpStatus.OK, "更新成功!");
  },
  //從 Middleware 之 JWT 取得 User 資訊
  async getProfile(req, res, next) {
    const user = req.user;
    handleSuccess(res, httpStatus.OK, user);
  },
  async getUser(req, res, next) {
    const email = req.params.id;
    const data = await usersModel.find({ email: email });
    if (!data.length) {
      return appError(httpStatus.BAD_REQUES, "email 不存在", next);
    }
    handleSuccess(res, httpStatus.OK, data);
  },
  async updUser(req, res, next) {
    const userId = req.user?._id;
    const data = req.body;
    let { name, photo } = data; //解構
    const updUser = await usersModel.updateOne(
      { _id: userId },
      { $set: { name, photo } }
    );
    if (!updUser) {
      return appError(httpStatus.BAD_REQUEST, "更新失敗！", next);
    }
    handleSuccess(res, httpStatus.OK, "更新成功!");
  },
  async getAllUsers(req, res, next) {
    const timeSort = req.query.timeSort === "asc" ? "createdAt" : "-createdAt";
    const limit = req.query.limit;
    const all = await usersModel.find().sort(timeSort).limit(limit);
    handleSuccess(res, httpStatus.OK, all);
  },
  async delUser(req, res, next) {
    const id = req.params.id;
    const originalUrl = req.originalUrl;
    if (!id || !originalUrl) {
      return appError(httpStatus.BAD_REQUEST, "參數有缺", next);
    }
    const user = await usersModel.find({ _id: id });
    if (!user.length) {
      return appError(httpStatus.BAD_REQUEST, "無此人", next);
    }
    const data = await usersModel.findByIdAndDelete(user);
    handleSuccess(res, httpStatus.OK, data);
  },
};
module.exports = usersController;
