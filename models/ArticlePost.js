const mongoose = require("mongoose");
const newArticleSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "貼文內容是必填項目"],
    },
    imageId: {
      type: String,
    },
    userId: {
      type: String,
      required: [true, "登入後才可填寫"],
    },
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    updateAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    createAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  {
    versionKey: false,
  }
);

const newArticleposts = mongoose.model("newArticle", newArticleSchema);

module.exports = newArticleposts;
