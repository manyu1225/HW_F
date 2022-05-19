const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const handleErrorAsync = require("../service/handleErrorAsync");
const appError = require("../service/appError");
const usersModel = require("../models/User");
const httpStatus = require("../utils/httpStatus");

const isAuth = handleErrorAsync(async (req, res, next) => {
  // 確認 token 是否存在
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(appError(httpStatus.UNAUTHORIZED, "尚未登入！", next));
  }
  // 驗證 token 正確性
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        if ("JsonWebTokenError" === err.name) {
          return next(appError(httpStatus.UNAUTHORIZED, "登入錯誤！", next));
        }
        //reject(err); //  "message": "系統錯誤，請恰系統管理員"
        return next(appError(httpStatus.UNAUTHORIZED, "登入錯誤！", next));
      } else {
        resolve(payload);
      }
    });
  });
  // 取得 User
  const currentUser = await usersModel.findById(decoded.id);
  req.user = currentUser;
  next();
});

module.exports = {
  isAuth,
};
