var db = require('./lib/db');
var md5 = require('md5');

console.log("请输入超级管理员帐号");
process.stdin.on('data', function(chunk) {
    var username = chunk.toString().trim();
    console.log("请输入超级管理员密码");
    process.stdin.on('data', function(chunk) {
        var password = chunk.toString().trim();
        var s = new db.Admin({
            username: username,
            password: md5(password),
            superUser:true,
            limit: [1, 2, 3, 4, 5, 6]
        });
        s.save(function(err){
            if(err){
              console.log("创建失败");
            }else{
              console.log("创建成功");
              process.exit();
            }
        });
    });
});