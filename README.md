# a-simpleDemo-of-express-mysql
## 是一个基于node express，连接mysql的小小的登录注册系统 ##
最终效果如图：
![登录页面](http://p1.bqimg.com/567571/74674607da346fad.png)

![注册页面](http://p1.bpimg.com/567571/fa469db80922c6d4.png)
开始注册了一个用户名为renwenji，密码为123456的用户,（其中密码采用md5方式加密),数据库表中保存如下：
![](http://p1.bpimg.com/567571/7e45e3abd8b6d91b.png)

目录结构是这样的：

![](http://p1.bqimg.com/567571/6cdf08d5607cf46d.png)

models文件夹里user.js主要是实现与数据库的连接，以及插入查询数据

node_modules的文件是最开始根据package.json的，用npm install所安装的一系列依赖

public:放css/images/stylesheets

routes:放对应的views里的文件对应的方法

views:视图，常用Ejs or jade模板渲染页面

app.js: express框架的入口文件


开始的工作要做好安装好node,npm,express，这之后

**用express blog**命令可以生成上述的目录结构


    package.json内容：
     {
      "name": "blog",
      "version": "0.0.0",
      "private": true,
      "scripts": {
    "start": "node ./bin/www"
      },
      "dependencies": {
	    "body-parser": "~1.15.2",
	    "cookie-parser": "~1.4.3",
	    "debug": "~2.2.0",
	    "ejs": "~2.5.2",
	    "express": "~4.14.0",
	    "morgan": "~1.7.0",
	    "serve-favicon": "~2.3.0",
	    "mysql":"latest",
	    "express-session":"latest"
      }
    }

使用npm 安装这些模块

    npm install

运行express应用

    npm start 

在浏览器输入http://localhost:3000，显示出这样就是运行成功了：

(![](http://i1.piimg.com/567571/965865d57cd5f163.png))

具体内容可以下载下来看看。现在总结一下这其中遇到的问题。

## 1.如何对用户输入的密码进行加密？##

**方法：**在对应的js里这样写：

    var crypto = require('crypto'); //需要引入这个模块
    var md5 = crypto.createHash('md5'); //md5加密
    var password = req.body.password; //获得post表单中的密码
        passwrod = md5.update(password).digest('hex');

## 2.登录注册用到了session,但是输入了正确的用户名和密码登陆后，本来应该跳转到一个欢迎xxx的界面，却报错：TypeError: Cannot set property 'user' of undefined -->提示req.session.user的user找不到？？？？##

**方法：**原本的app.js里的其中一部分是这样写的：

    var index = require('./routes/index');

    var main = require('./routes/main');
    var regist = require('./routes/regist');
    
    var app = express();
    
    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    
    // uncomment after placing your favicon in /public
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser("An"));
    
    app.use(express.static(path.join(__dirname, 'public')));
    
    
    app.use('/', index);
    app.use('/main', main);
    app.use('/regist', regist);
    
    app.use(session({
      secret:'an',
      resave:false, //是指每次请求都重新设置session cookie，假设你的cookie是10分钟过期，每次请求都会再设置10分钟
      saveUninitialized:false //是指无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
    }));


关于登录页面的index.js是这样写的：

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
              req.session.user = user;//保存用户session信息  -->即报错信息出现在这里
              res.redirect('/main');
             }
            else{
                 res.render('index',{errMsg:'密码有误'});
             }
         }
    });
});

    module.exports = router;

后来查阅了资料发现问题所在：
    
    app.use(app.router);

**注意上述一行语句的放置顺序很重要，不要放在session之前，要放在session之后，否则就会报错！**

所以解决办法是：

  将app.js里的这两段代码顺序调整一下成这样：

    即app.use('/',index)...这段在app.use(session({...}))后面
  
      app.use(session({
      secret:'an',
      resave:false, //是指每次请求都重新设置session cookie，假设你的cookie是10分钟过期，每次请求都会再设置10分钟
      saveUninitialized:false //是指无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
    }));
    
    	app.use('/', index);
    	app.use('/main', main);
    	app.use('/regist', regist);

  



    