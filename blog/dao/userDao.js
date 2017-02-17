//用户数据操作
var login = require('../routes/login');
var regist = require('../routes/regist');

//调用登录方法
var loginDo = function(username,password,callback){
	login.login(username,password,function(res){
		callback(res);
	})
}

//调用注册方法
var registDo = function(username,password,callback){
	regist.regist(username,password,function(res){
		callback(res);
	})
}

exports.login = loginDo;
exports.regist = registDo;