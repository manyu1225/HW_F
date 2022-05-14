const express = require("express");
const router = express.Router();
const userController = require("../controller/users");

router.get("/", function (req, res, next) {
  /*
   *   #swagger.tags = ['Users']
   *   #swagger.description = 'Endpoint to  Users'
   *   #swagger.path = '/users'
   *   #swagger.method = 'GET'
   *   #swagger.produces = ["application/json"]
   */
  res.send("respond with a resource");
});

/* 取得 User 資訊
router.get('/user', function(req, res, next) {
    res.send('respond with a resource');
  });

/*註冊+
router.post('/register',  function(req, res, next) {
  res.send('respond with a resource');
});
*/

module.exports = router;
