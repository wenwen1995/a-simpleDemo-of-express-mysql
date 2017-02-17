//connect mysql
var mysql = require("mysql"); //请求数据库

var dbName = 'test';

var pool = mysql.createPool({
	 host:'localhost',
	 user:'root',
	 password:'',
	 database:'test',
   port:'3306'
});
//可以监听connection事件，并设置session值
pool.on('connection',function(connection){
	 console.log('pool on');
	 connection.query('SET SESSION auto_increment=1')
});

function User(user){
	this.username=  user.username;
	this.password = user.password;
}

//将用户名、密码插入数据库中
User.prototype.userSave = function save(callback){
	 var user = {
	 	 username:this.username,
	 	 password:this.password
	 };
	 var INSERT_USER = "INSERT INTO userInfo(userid,username,password) values (0,?,?)";
	 pool.getConnection(function(err,connection){
        connection.query(INSERT_USER,[user.username,user.password],function(err,result){
        	 if(err){
        	 	console.log('INSERT_USER Error:'+err.message);
        	 	return;
        	 }
        	 connection.release();
        	 callback(err,result);
        });
	 });
};

//根据用户名得到用户数量
User.prototype.userNum = function(username, callback) {
  pool.getConnection(function(err,connection){
    console.log("getConnection");
    console.log("getUserNumByName");
    var SELECT_NUM = "SELECT COUNT(1) AS num FROM USERINFO WHERE USERNAME = ?";
    connection.query(SELECT_NUM, [username], function (err, result) {
      if (err) {
        console.log("SELECT_NUM Error: " + err.message);
        return;
      }
      connection.release();
      callback(err,result);
    });
  });
};

User.prototype.userInfo = function(callback){
  var user = {
     username:this.username,
     password:this.password
  };
  var SELECT_LOGIN ="SELECT * FROM userInfo WHERE USERNAME = ?";
  pool.getConnection(function(err,connection){
    connection.query(SELECT_LOGIN,[user.username],function(err,result){
      if (err) {
        console.log("SELECT_LOGIN Error: " + err.message);
        return;
      }
      connection.release();
      callback(err,result);
    });
  });
}

module.exports = User;



