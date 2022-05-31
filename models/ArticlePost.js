const mongoose = require("mongoose");
const newArticleSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: function () {
        return !this.imageId;
      },
    },
    imageId: {
      type: String,
      required: function () {
        return !this.content;
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "登入後才可填寫"],
    },
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
    updateAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments",
      },
    ],
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

newArticleSchema.virtual("likeCount", {
  ref: "Likes",
  localField: "_id",
  foreignField: "post",
  justOne: false,
  count: true,
});

newArticleSchema.virtual("comment", {
  ref: "comment",
  foreignField: "newArticle",
  localField: "_id",
});
const newArticleposts = mongoose.model("newArticle", newArticleSchema);

module.exports = newArticleposts;
