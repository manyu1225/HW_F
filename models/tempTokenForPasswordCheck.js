const mongoose = require("mongoose");
const tempPasswordSchema = new mongoose.Schema(
  {
    token: {
        type: String,
        select: false,
    },
    email: {
      type: String,
      required: [true, "email must have value."],
      select: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
const tempToken = mongoose.model("tempPasswordToken", tempPasswordSchema);

module.exports = tempToken;
