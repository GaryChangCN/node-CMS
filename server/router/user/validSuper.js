var cry = require('../../lib/cry');
var db=require('../../lib/db');
var md5=require('md5');

module.exports = function*(next) {
    var password=this.request.body.password;
    var power= yield db.Admin.findOne({superUser:true}).exec().then(function(value){
        if(md5(password)==value.password){
            return true;
        }else{
            return false;
        }
    })
    if (power) {
        var a="yes#"+new Date().getTime();
        this.cookies.set('superMe',cry.en(a));
        this.body = {
            power:true
        }
    } else {
        this.body = {
            power:false
        }
    }
}