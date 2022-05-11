
const handleSuccess = require('../utils/handleSuccess');
const handleError = require('../utils/handleError');
const httpStatus = require('../utils/httpStatus');
const Post = require('../model/Posts');

exports.getPosts = async (req, res, next) => {
    const timeSort = req.query.timeSort === 'asc' ? 'createdAt' : '-createdAt';
    const limit = req.query.limit;
    const all = await Post.find().sort(timeSort).limit(limit);
    handleSuccess(res, httpStatus.OK, all);
}
exports.createPosts = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await Post.find({ _id: id });
        if (data.length) {
            handleSuccess(res, httpStatus.OK, data);
        } else {
            handleError(res, httpStatus.BAD_REQUEST, "id 不存在");
        }
    } catch (err) {
        handleError(res, httpStatus.BAD_REQUEST, err.message);
    }
}
exports.getAllPosts = async (req, res, next) => {
    try {
        const data = req.body;
        let { name, tags, type, content } = data; //解構
        if (!name || !type || !tags || !content) {
            handleError(res, httpStatus.BAD_REQUEST, '請確認欄位');
            return;
        } else {
            const newUser = await Post.create({ name, tags, type, content })
            handleSuccess(res, httpStatus.OK, newUser);
        }
    } catch (error) {
        handleError(res, httpStatus.BAD_REQUEST, error.message);
    }
}
exports.updPosts = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        if (!data) {
            handleError(res, httpStatus.BAD_REQUEST, "不可為空物件");
            return;
        }
        const updPost = await Post.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!updPost) {
            handleError(res, httpStatus.BAD_REQUEST, "無此ID");
        } else {
            handleSuccess(res, httpStatus.OK, updPost);
        }
    } catch (error) {
        handleError(res, httpStatus.INTERNAL_SERVER, error.message);
    }
}
exports.delPosts = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            handleError(res, httpStatus.BAD_REQUEST, "參數有缺");
            return;
        }
        const data = await Post.findByIdAndDelete(id);
        if (!data) {
            handleError(res, httpStatus.BAD_REQUEST, "無該ID");
            return;
        }
        handleSuccess(res, httpStatus.OK, data);
    } catch (error) {
        handleError(res, httpStatus.INTERNAL_SERVER, error.message);
    }
}
exports.delAllPosts = async (req, res, next) => {

    try {
        await Post.deleteMany({});
        handleSuccess(res, httpStatus.OK, []);
    } catch (error) {
        handleError(res, httpStatus.INTERNAL_SERVER, error.message);
    }
}
