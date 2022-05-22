const handleErrorAsync = require("../service/handleErrorAsync");
const appError = require("../service/appError");
const usersModel = require("../models/User");
const tempPasswordToken =require('../models/tempTokenForPasswordCheck');
const httpStatus = require("../utils/httpStatus");
const validator = require("validator");

const isDbToken = handleErrorAsync(async (req, res, next) => {
    const authorization = req.headers.authorization;
    let token;
    if (authorization && authorization.startsWith("Bearer")) {
        token = authorization.split(" ")[1];
    }
  if (! token) {
    return next(appError(httpStatus.UNAUTHORIZED, "異常處理(無效驗證)！", next));
  }  
  
  const tokenData = await tempPasswordToken.findOne(
    {
            token:token
    }   
  );
  const email = tokenData.email;
  if (! email) {
    return next(appError(httpStatus.UNAUTHORIZED, "異常處理(無效驗證)！", next));
  }
  

  // 取得 User
  const userData =await usersModel.findOne(
    {
            email:email
    }       
  )      
  req.user = userData;
  next();
});

module.exports =  isDbToken

