const handleErrorAsync = require("../service/handleErrorAsync");
const appError = require("../service/appError");
const httpStatus = require("../utils/httpStatus");
const handleSuccess = require("../service/handleSuccess");
const usersModel = require("../model/User");

const usersController = {
  // #swagger.tags = ['Users']
  getAllUsers: handleErrorAsync(async (req, res, next) => {
    /*
      #swagger.tags = ['Users']
      #swagger.description = 'Endpoint to get All Users'
      #swagger.path = '/users'
      #swagger.method = 'GET'
      #swagger.produces = ["application/json"]
     */
    const timeSort = req.query.timeSort === "asc" ? "createdAt" : "-createdAt";
    const limit = req.query.limit;
    const all = await usersModel.find().sort(timeSort).limit(limit);
    // #swagger.responses[200] = { description: 'successfully.' }
    handleSuccess(res, httpStatus.OK, all);
  }),
  getUser: handleErrorAsync(async (req, res, next) => {
    /*
      #swagger.tags = ['Users']
      #swagger.description = '取得 User 資訊'
      #swagger.path = '/users/{id}'
      #swagger.method = 'GET'
      #swagger.produces = ["application/json"]
     */
    const id = req.params.id;
    const data = await usersModel.find({ _id: id });
    if (data.length) {
      // #swagger.responses[200] = { description: 'Some description...' }
      handleSuccess(res, httpStatus.OK, data);
    } else {
      // #swagger.responses[400]
      return appError(httpStatus.BAD_REQUES, "id 不存在");
    }
  }),
  createUser: handleErrorAsync(async (req, res, next) => {
    /*
      #swagger.tags = ['Users']
      #swagger.description = ' User註冊'
      #swagger.path = '/users'
      #swagger.method = 'POST'
      #swagger.produces = ["application/json"]
      #swagger.parameters['body'] = {
        in: 'body',
        type :"object",
        required:true,
        description: "資料格式",
        schema: {
                "$name": 'Jhon Doe',
                "$tags": 'AAA',
                "$type":  'group',
                "$content":'XXX'
            }
        }
     */
    const data = req.body;
    let { name, tags, type, content } = data; //解構
    if (!name || !type || !tags || !content) {
      // #swagger.responses[400]
      return appError(httpStatus.BAD_REQUEST, "請確認欄位");
    } else {
      // #swagger.responses[200]
      const newUser = await usersModel.create({ name, tags, type, content });
      handleSuccess(res, httpStatus.OK, newUser);
    }
  }),
  updUser: handleErrorAsync(async (req, res, next) => {
    /*
      #swagger.tags = ['Users']
      #swagger.description = '更新User'
      #swagger.path = '/users/{id}'
      #swagger.method = 'PATCH'
      #swagger.produces = ["application/json"]
      #swagger.parameters['body'] = {
        in: 'body',
        type :"object",
        required:true,
        description: "資料格式",
        schema: {
                "$name": 'Jhon DoeB',
                "$tags": 'BBB',
                "$type":  'group',
                "$content":'XXXB'
            }
        }
     */
    const id = req.params.id;
    const data = req.body;
    if (!data) {
      // #swagger.responses[400]
      return appError(httpStatus.BAD_REQUEST, "不可為空物件");
    }
    const updPost = await usersModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updPost) {
      // #swagger.responses[400]
      return appError(httpStatus.BAD_REQUEST, "無此ID");
    } else {
      // #swagger.responses[200]
      handleSuccess(res, httpStatus.OK, updPost);
    }
  }),
  delUser: handleErrorAsync(async (req, res, next) => {
    /*
      #swagger.tags = ['Users']
      #swagger.description = 'DELETE User'
      #swagger.path = '/users/{id}'
      #swagger.method = 'DELETE'
      #swagger.produces = ["application/json"]
      #swagger.security = [{
               "apiKeyAuth": []
        }]
     */
    const id = req.params.id;
    if (!id) {
      return appError(httpStatus.BAD_REQUEST, "參數有缺");
    }
    const data = await usersModel.findByIdAndDelete(id);
    if (!data) {
      // #swagger.responses[400]
      return appError(httpStatus.BAD_REQUEST, "無該ID");
    }
    // #swagger.responses[200]
    handleSuccess(res, httpStatus.OK, data);
  }),
  delAllUsers: handleErrorAsync(async (req, res, next) => {
    /*
     #swagger.tags = ['Users']
     #swagger.description = 'EDELETE All Users'
     #swagger.path = '/users'
     #swagger.method = 'DELETE'
     #swagger.produces = ["application/json"]
     */
    await usersModel.deleteMany({});
    // #swagger.responses[200]
    handleSuccess(res, httpStatus.OK, []);
  }),
};
module.exports = usersController;
