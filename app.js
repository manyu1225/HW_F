const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser"); //
const logger = require("morgan"); // Log 紀錄
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json"); // 剛剛輸出的 JSON
require("./utils/conn.js");
var httpStatusCodes = require("./utils/httpStatus");
// routes
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var newPostRouter = require("./routes/article");
var uploadRouter = require("./routes/upload");
var forgetPWRouter = require("./routes/forgetPassWord");
var lineRouter = require("./routes/lineAPI");
var app = express();

//同步的程式出錯，程式出現重大錯誤時
process.on("uncaughtException", (err) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error("漏洞：Uncaughted Exception");
  console.error(err);
  process.exit(1);
});

// middlewares
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use(usersRouter);
app.use("/article", newPostRouter);
app.use("/forget", forgetPWRouter);
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/upload", uploadRouter);
app.use(lineRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.error("出現重大錯誤.....", err);
  // 送出罐頭預設訊息
  res.status(404).json({
    status: "error",
    message: "系統錯誤，請恰系統管理員......d",
  }); // 呼叫 next 把控制權轉移到下一個 middleware
});

// 自己設定的 err 錯誤
const resErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  } else {
    // log 紀錄
    console.error("出現重大錯誤", err);
    // 送出罐頭預設訊息
    res.status(500).json({
      status: "error",
      message: "系統錯誤，請恰系統管理員",
    });
  }
};
// 開發環境錯誤
const resErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

app.use(function (err, req, res, next) {
  // dev way
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === "dev") {
    return resErrorDev(err, res);
  }

  // production way
  switch (err.name) {
    case "CastError":
      err.statusCode = httpStatusCodes.BAD_REQUEST;
      err.message = "無此 id 資料，請確認後重新輸入！";
      err.isOperational = true;
      resErrorProd(err, res);
      break;

    case "ValidationError":
      err.statusCode = httpStatusCodes.BAD_REQUEST;
      err.message = "資料欄位未填寫正確，請重新輸入！";
      err.isOperational = true;
      resErrorProd(err, res);
      break;

    case "TokenExpiredError":
      err.statusCode = httpStatusCodes.UNAUTHORIZED;
      err.message = "登入憑證過期，請重新登入！";
      err.isOperational = true;
      resErrorProd(err, res);
      break;
      s;
    case "JsonWebTokenError":
      err.statusCode = httpStatusCodes.UNAUTHORIZED;
      err.message = "登入憑證錯誤！";
      err.isOperational = true;
      resErrorProd(err, res);
      break;

    default:
      resErrorProd(err, res);
      break;
  }
});

/**
 * 非同步程式/未捕捉到的 catch
 */
process.on("unhandledRejection", (err, promise) => {
  console.error("漏洞：未捕捉到的 rejection：", promise, "原因：", err);
  // 記錄於 log 上
});
module.exports = app;
