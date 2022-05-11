const  express = require('express');
const  router = express.Router();
const userController = require('../controllers/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* 取得 User 資訊*/
router.get('/user', function(req, res, next) {
    res.send('respond with a resource');
  });

/*註冊+*/
router.post('/register',  function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
