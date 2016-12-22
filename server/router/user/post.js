var db = require('../../lib/db');
var md5 = require('md5');

module.exports = function*(next) {
    if (this.method.toUpperCase() == "POST") {
        try {
            var ctx = this;
            var username = this.request.body.username;
            var a = yield db.Admin.count({ username: username }).exec().then(function(value) {
                return value;
            }).then(function(value) {
                if (value > 0) {
                    return false;
                } else {
                    var password = md5(ctx.request.body.password);
                    var limit = ctx.request.body.limit;
                    var s = new db.Admin({
                        username: username,
                        password: password,
                        limit: JSON.parse(limit)
                    });
                    return s.save();
                }
            });
            if (a) {
                this.body = {
                    err: false,
                    state: true
                }
            } else {
                this.body = {
                    err: "username",
                    state: true
                }
            }
        } catch (error) {
            this.logger.error(error);
            yield next;
        }
    } else {
        yield next;
    }
}