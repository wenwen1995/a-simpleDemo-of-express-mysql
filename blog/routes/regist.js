//regist
var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var User = require('../models/user.js');

router.get('/',function(req,res,callback){
	res.render('regist',{errMsg:''});
});


router.post('/',function(req,res){
	 //获得form表单提交的数据
    var username = req.body.username;
    var password = req.body.password;
   
    //加密密码
    var md5 = crypto.createHash('md5');
        password = md5.update(password).digest('hex');
    console.log(password);

    var newUser = new User({
    	username:username,
    	password:password
    });
    //检测用户是否存在
    newUser.userNum(newUser.username,function(err,results){
    	if(results != null && results[0]['num'] > 0){
    		err = '用户名已经存在'
    	}
    	if(err){
    		res.render('regist',{errMsg:err});
    		return;
    	}

    	newUser.userSave(function(err,result){
    		if(err){
    		  res.render('regist',{errMsg:err});
    		  return;
    		}
    		if(result.insertId > 0){
    			res.locals.status = "success";
    			res.render('regist',{errMsg:''});
    		}else{
    			res.render('regist',{errMsg:err});
    		}
    	});
    });
});

module.exports = router; //对外提供router