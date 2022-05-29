const express = require("express");
const router = express.Router();
const lineAPIController = require("../controller/lineAPI");
const handleErrorAsync = require("../service/handleErrorAsync");
router.get(
  "/authorize",
  handleErrorAsync(async (req, res, next) =>
    lineAPIController.authorize(req, res, next)
  )
);
router.get(
  "/callback",
  handleErrorAsync(async (req, res, next) =>
    lineAPIController.callback(req, res, next)
  )
);
router.post(
  "/userInfo",
  handleErrorAsync(async (req, res, next) =>
    lineAPIController.getLineUserInfo(req, res, next)
  )
);
module.exports = router;
