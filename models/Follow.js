const mongoose = require("mongoose");
const followSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "登入後才可填寫"],
    },
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "被追蹤者為必填"],
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

const follow = mongoose.model("Follow", followSchema);

module.exports = follow;
