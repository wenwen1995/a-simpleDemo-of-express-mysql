var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var User = require('../models/user.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { errMsg: '' });
});

router.post('/',function(req,res){
	//获得form表单提交的数据
    var username = req.body.username;
    var password = req.body.password;

    //加密密码
    var md5 = crypto.createHash('md5');
        password = md5.update(password).digest('hex');
    console.log(password);

    var loginUser = new User({
    	username:username,
    	password:password
    });
    //通过用户名得到用户信息
    loginUser.userInfo(function(err,result){
    	 if(err){
    	 	res.render('index',{errMsg:err});
    	 	return;
    	 }
    	 if(result == ''){
    	 	res.render('index',{errMsg:'用户名不存在'});
    	 	return;
    	 }
         else{
    	 	if(result[0]['password'] == password){
              var user = {'username':username};
              req.session.user = user;//保存用户session信息
              res.redirect('/main');
             }
            else{
    	 		res.render('index',{errMsg:'密码有误'});
    	 	}
    	 }
    });
});

module.exports = router;
