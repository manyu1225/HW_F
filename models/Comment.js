const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "回覆必須要有值"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "userId 必填"],
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "newArticle",
    required: [true, "ArticleId 必填"],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
    select: true,
  },
});

const Comments = mongoose.model("comments", commentSchema);

module.exports = Comments;
