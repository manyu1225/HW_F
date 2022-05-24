const express = require("express");
const router = express.Router();
const lineAPIController = require("../controller/lineAPI");
const handleErrorAsync = require("../service/handleErrorAsync");
router.get(
  "/line/authorize",
  handleErrorAsync(async (req, res, next) =>
    lineAPIController.authorize(req, res, next)
  )
);
router.get(
  "/line/callback",
  handleErrorAsync(async (req, res, next) =>
    lineAPIController.callback(req, res, next)
  )
);
router.post(
  "/line/token",
  handleErrorAsync(async (req, res, next) =>
    lineAPIController.getLinetoken(req, res, next)
  )
);
router.post(
  "/line/userInfo",
  handleErrorAsync(async (req, res, next) =>
    lineAPIController.getLineUserInfo(req, res, next)
  )
);
module.exports = router;
