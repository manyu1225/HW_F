const mongoose = require("mongoose");

const likesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "user 必填"],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "newArticle",
      required: [true, "post 必填"],
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

const Likes = mongoose.model("Likes", likesSchema);

module.exports = Likes;
