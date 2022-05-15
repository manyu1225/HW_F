const appError = (httpStatus, errMessage, next) => {
  const error = new Error(errMessage);
  error.statusCode = httpStatus;
  error.isOperational = true;
  next(error);
  //最後使用 next() 將 Error 交給 app.js 中的錯誤處理 middleware 回傳錯誤訊息
};

module.exports = appError;
