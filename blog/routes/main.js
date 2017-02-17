var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
   var user = req.session.user;
   res.render('main',{username:user.username});
});

module.exports = router;
