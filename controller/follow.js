const Follow = require("../models/Follow");
const User = require("../models/User");
const appError = require("../service/appError");
const httpStatus = require("../utils/httpStatus");
const handleSuccess = require("../service/handleSuccess");
const handleErrorAsync = require("../service/handleErrorAsync");

const articleController = {
  async getAll(req, res, next) {
    handleErrorAsync(async (req, res, next) => {
      /*  #swagger.tags = ['Follow']
          #swagger.summary="取得追蹤清單"
          #swagger.description = '取得追蹤清單'
          #swagger.method = 'GET'
          #swagger.produces = ["application/json"]
          #swagger.security = [{ "Bearer": [] }]
          #swagger.parameters['query'] = [{
            in: 'query',
            name:"pageCount"
            type :"number",
            description:"每頁筆數 (required,預設10筆,number)"
          },
          {
            in: 'query',
            name:"page"
            type :"number",
            description:"目前第幾頁(required,最小為 1,number)"
          },
          {
            in: 'query',
            name:"sort"
            type :"number",
            description:"排序類型(required, [ 1 發文時間],number)"
          },
          {
            in: 'query',
            name:"reverse"
            type :"boolean",
            description:"排序順反向(required, [true順向(大到小、新到舊)、false(反向、與前者相反)],boolean) "
          }]
      */
      let pageCount = req.query.pageCount || 10; //預設為10筆
      let page = (req.query.page || 1 )-1; //頁數最小為0頁，但閱讀不易所以改成第1頁為開始
      let startIndex=  pageCount*page;
      let keyWord = req.query.content;
      let userId=req.query.userId;
      let sort = (req.query.sort|| "createAt")
      let result = await Follow.find()
      .populate({
        path: "userId",
        select: "_id name photo",
      })      
      .populate({
        path: "targetUserId",
        select: "_id name photo",
      })
      .skip(startIndex)
      .limit(pageCount);     
      handleSuccess(res, httpStatus.OK, result);
    })(req, res, next);
  },
  async createFollow(req, res, next) {
    handleErrorAsync(async (req, res, next) => {
      /*  #swagger.tags = ['Follow']
          #swagger.summary="新增追蹤"
          #swagger.description = '新增追蹤'
          #swagger.method = 'POST'
          #swagger.produces = ["application/json"]
          #swagger.security = [{ "Bearer": [] }]
          #swagger.parameters['body'] = {
            in: 'body',
            type :"object",
            required:true,
            schema: {
                    targetUserId:"被追蹤的人ID"
                }
            }
      */
       let targetUserId =req.body.targetUserId;
       if (! targetUserId) {
           return appError(
            httpStatus.BAD_REQUES,
            "被追蹤人ID為必填",
            next
          );
       }
       if (targetUserId == req.user._id) {
        return appError(
            httpStatus.BAD_REQUES,
            "不能追蹤自己",
            next
          );
       }

       let targetUserCheck = await User.findById(targetUserId);
       if (! targetUserCheck) {
        return appError(
            httpStatus.BAD_REQUES,
            "追蹤失敗，被追蹤人不存在",
            next
          );
       } 
       let targetExist =await Follow.findOne(
           {
                userId:req.user._id,
                targetUserId:targetUserId
           }
       )
       if(targetExist){
        return appError(
            httpStatus.BAD_REQUES,
            "追蹤失敗，目前已追蹤了",
            next
          );
       }

       let result = await Follow.create({
           userId:req.user._id,
           targetUserId:targetUserId
       })
       handleSuccess(res, httpStatus.OK, result);
    })(req, res, next);
  },
  async deleteFollow(req, res, next) {
    handleErrorAsync(async (req, res, next) => {
        /*  #swagger.tags = ['Follow']
          #swagger.summary="取消追蹤"
          #swagger.description = '取消追蹤'
          #swagger.method = 'DELETE'
          #swagger.produces = ["application/json"]
          #swagger.security = [{ "Bearer": [] }]
      */
        let followId =req.params.followId;
        let result = await Follow.findOneAndDelete({
            "_id":followId
        })
       handleSuccess(res, httpStatus.OK, result);
    })(req, res, next);
  }
};

module.exports = articleController;
