var db = require('../lib/db');
var md5 = require('md5');
var cry = require('../lib/cry');

module.exports = function*(next) {
    var cookieVerify = cry.de(this.cookies.get('verify'));
    if (cookieVerify == this.request.body.verify) {
        var ctx=this;
        try {
            var p = new Promise(function(resolve, reject) {
                db.Admin.valida({
                    username: ctx.request.body.username,
                    password: md5(ctx.request.body.password)
                },function(err,doc){
                    if(err){
                        reject(err);
                    }else{
                        resolve(doc);
                    }
                })
            });
            var a = yield p;
            this.body = { err: false, limit: a.limit };
            var t=[];
            var v=t.concat(a.limit);
            v.push(cookieVerify);
            var time=new Date().getTime();
            this.cookies.set('sessionId',cry.en(time.toString()));
            this.cookies.set('limit',cry.en(JSON.stringify(v)));
        } catch (error) {
            this.logger.error(error);
            ctx.body = {
                err: 'auth'
            }
        }
    } else {
        this.body = {
            err: 'verify'
        }
    }
}