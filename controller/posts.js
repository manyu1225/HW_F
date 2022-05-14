const handleErrorAsync = require("../service/handleErrorAsync");
const appError = require("../service/appError");
const httpStatus = require("../utils/httpStatus");
const handleSuccess = require("../service/handleSuccess");
const postsModel = require("../model/Post");

/*
    router.get('/', async function(req, res, next) {
        const timeSort = req.query.timeSort == "asc" ? "createdAt":"-createdAt"
        const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
        const post = await Post.find(q).populate({
            path: 'user',
            select: 'name photo '
          }).sort(timeSort); 
        res.status(200).json({
          post
        })
      });
      */
exports.getAllPosts = handleErrorAsync(async (req, res, next) => {
  /* 
    #swagger.tags = ['Posts']
    #swagger.description = 'Endpoint to get All Posts'
    #swagger.path = '/posts'
    #swagger.method = 'GET'
    #swagger.produces = ["application/json"]
  */
  const timeSort = req.query.timeSort === "asc" ? "createdAt" : "-createdAt";
  const limit = req.query.limit;
  const all = await postsModel.find().sort(timeSort).limit(limit);
  // #swagger.responses[200] = { description: 'Some description...' }
  handleSuccess(res, httpStatus.OK, all);
});
exports.getPosts = handleErrorAsync(async (req, res, next) => {
  /* 
     #swagger.tags = ['Posts']
     #swagger.description = 'Endpoint get Posts in a specific user'
      #swagger.path = '/posts/{id}'
     #swagger.method = 'GET'
       #swagger.produces = ["application/json"]
     */
  const id = req.params.id;
  const data = await postsModel.find({ _id: id });
  if (data.length) {
    // #swagger.responses[200] = { description: `get successfully.` }
    handleSuccess(res, httpStatus.OK, data);
  } else {
    // #swagger.responses[400]
    return appError(httpStatus.BAD_REQUES, "id 不存在");
  }
});
exports.createPosts = handleErrorAsync(async (req, res, next) => {
  /*
      #swagger.tags = ['Posts']
      #swagger.description = Endpoint create Posts'
      #swagger.path = '/posts'
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
    const newUser = await postsModel.create({ name, tags, type, content });
    handleSuccess(res, httpStatus.OK, newUser);
  }
});
exports.updPosts = handleErrorAsync(async (req, res, next) => {
  /*
       #swagger.tags = ['Posts']
       #swagger.description = 'Endpoint to update Posts'
       #swagger.path = '/posts/{id}'
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
  const updPost = await postsModel.findByIdAndUpdate(id, data, {
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
});
exports.delPosts = handleErrorAsync(async (req, res, next) => {
  /*
      #swagger.tags = ['Posts']
       #swagger.description = 'Endpoint to delete Posts '
      #swagger.path = '/posts/{id}'
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
  const data = await postsModel.findByIdAndDelete(id);
  if (!data) {
    // #swagger.responses[400]
    return appError(httpStatus.BAD_REQUEST, "無該ID");
  }
  // #swagger.responses[200]
  handleSuccess(res, httpStatus.OK, data);
});
exports.delAllPosts = handleErrorAsync(async (req, res, next) => {
  /*
     #swagger.tags = ['Posts']
     #swagger.description = 'Endpoint to delete All Posts'
     #swagger.path = '/posts'
      #swagger.method = 'DELETE'
      #swagger.produces = ["application/json"]
     */
  await postsModel.deleteMany({});
  // #swagger.responses[200]
  handleSuccess(res, httpStatus.OK, []);
});
