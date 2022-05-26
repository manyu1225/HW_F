const mongoose = require("mongoose");
const newArticleSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: function(){return !this.imageId ;}
    },
    imageId: {
      type: String,
      required: function(){return !this.content; }
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
      select: false,
    },
  },
  {
    versionKey: false,
  }
);

const newArticleposts = mongoose.model("newArticle", newArticleSchema);

module.exports = newArticleposts;
