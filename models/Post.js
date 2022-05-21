const mongoose = require("mongoose");
const postsSchema = new mongoose.Schema(
  {
    tags: [
      {
        type: String,
        required: [true, "the Posts tags must have value."],
      },
    ],
    type: {
      type: String,
      enum: ["group", "person"],
      required: [true, "Posts type must have value."],
    },
    image: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    content: {
      type: String,
      required: [true, "Content must have values."],
    },
    likes: {
      type: String,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: [true, "使用者 ID 必填"],
    },
  },
  {
    versionKey: false,
  }
);

const posts = mongoose.model("posts", postsSchema);

module.exports = posts;
