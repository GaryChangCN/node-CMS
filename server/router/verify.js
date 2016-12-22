var captchapng = require('../lib/captchapng');
var cry=require('../lib/cry');
module.exports = function*(next) {
    var verify = parseInt(Math.random() * 9000 + 1000);
    this.cookies.set('verify',cry.en(verify));
    var p = new captchapng(80, 30, verify);
    p.color(0, 0, 0, 0);
    p.color(32, 160, 255, 255);
    var img = p.getBase64();
    var imgbase64 = new Buffer(img, 'base64');
    this.body=imgbase64;
}