const Article = require("../models/ArticlePost");
const Comment = require("../models/Comment");
const User = require("../models/User");
const appError = require("../service/appError");
const httpStatus = require("../utils/httpStatus");
const handleSuccess = require("../service/handleSuccess");
const handleErrorAsync = require("../service/handleErrorAsync");

const CommentController = {
  async createComment(req, res, next) {
    const { postId, content } = req.body;
    if (!content) return appError(httpStatus.BAD_REQUEST, "請輸入文字！", next);
    const isExist = await Article.findById(postId).exec();
    if (!isExist)
      return appError(
        httpStatus.BAD_REQUEST,
        "該貼文已被刪除，請重新整理!",
        next
      );
    const newComment = await Comment.create({
      user: req.user._id,
      post: postId,
      content,
    });

    if (!newComment.post) {
      return appError(httpStatus.BAD_REQUEST, "留言新增失敗!", next);
    }
    await Article.findByIdAndUpdate(
      postId,
      { $push: { comments: newComment._id } },
      { new: true }
    );
    const user = await User.findById(newComment.user);
    handleSuccess(res, httpStatus.OK, {
      postId: newComment.post,
      updateAt: newComment.updateAt,
      createAt: newComment.createAt,
      content: newComment.content,
      user: user._id,
    });
  },

  async deleteComments(req, res, next) {
    const commentId = req.params.id;
    const isCommentExist = await Comment.findById(commentId).exec();
    if (!isCommentExist)
      return appError(
        httpStatus.BAD_REQUEST,
        "該貼文已被刪除，刪除失敗!",
        next
      );
    const deleteComment = await Comment.findByIdAndDelete({
      _id: commentId,
    });
    if (!deleteComment)
      return appError(httpStatus.BAD_REQUEST, "刪除失敗!", next);
    handleSuccess(res, httpStatus.OK, `刪除 commenid  ${commentId} 成功`);
  },

  //該貼文德
  async getComment(req, res, next) {
    const postId = req.params.id;
    const isCommentExist = await Comment.findById(commentId).exec();
    if (!isCommentExist)
      return appError(httpStatus.BAD_REQUEST, "查詢失敗!", next);
    const data = await Article.find({ postId: postId });
    handleSuccess(res, httpStatus.OK, data);
  },
};
module.exports = CommentController;
