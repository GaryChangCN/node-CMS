var db = require('../lib/db');
var md5 = require('md5');
var cry = require('../lib/cry');

module.exports = function*(next) {
    var cookieVerify = cry.de(this.cookies.get('verify'));
    if (/^\d{4}$/.test(cookieVerify) && cookieVerify === String(this.request.body.verify)) {
        var ctx=this;
        try {
            if (typeof ctx.request.body.username !== 'string' || typeof ctx.request.body.password !== 'string') {
                throw new TypeError('Credentials must be strings');
            }
            var a = yield db.Admin.valida({
                username: ctx.request.body.username,
                password: md5(ctx.request.body.password)
            });
            if (!a) {
                throw new Error('Invalid credentials');
            }
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