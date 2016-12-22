var cry = require('../lib/cry');

module.exports = function*(next) {
    var c = this.cookies.get('sessionId');
    if (c) {
        var time = parseInt(cry.de(c));
        var now=new Date().getTime();
        if (time&&now-time<28800000) {
            yield next;
        } else {
            this.body = {
                state: false,
                msg:"会话过期"
            }
        }
    } else {
        this.body = {
            state: false
        }
    }
}