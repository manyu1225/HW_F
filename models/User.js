const mongoose = require("mongoose");
const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "姓名必須要有值"],
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "email必須要有值"],
      select: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "密碼必須要有值"],
      minlength: 8,
      select: false,
    },
    token: {
      type: String,
      select: false,
    },
    photo: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "unknown",
      enum: ["unknown", "male", "female"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
const Users = mongoose.model("users", usersSchema);

module.exports = Users;
