const mongoose = require("mongoose");
const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name must have value."],
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "email must have value."],
      select: false,
      unique: true,
    },
    photo: {
      type: String,
      default: "",
    },
    //  password: {
    //    type: String,
    //    required: [true, "password must have value."],
    //    select: false,
    //  },
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
