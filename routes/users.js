const express = require("express");
const router = express.Router();
const UsersController = require("../controller/users");

router.get("/", UsersController.getAllUsers);
router.get("/:id", UsersController.getUser);
router.post("/register", UsersController.createUser);
router.patch("/:id", UsersController.updUser);
router.delete("/:id", UsersController.delUser);
router.delete("/", UsersController.delAllUsers);

module.exports = router;
