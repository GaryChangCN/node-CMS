var db = require('../../lib/db');
var md5 = require('md5');

module.exports = function*(next) {
    if (this.method.toUpperCase() == "PUT") {
        try {
            var _id = this.request.body._id;
            var change = JSON.parse(this.request.body.change);
            if (change.password) {
                var m = md5(change.password);
                change.password = m;
            }
            delete change.superUser;
            var a = yield db.Admin.update({ _id: _id }, { $set: change }).exec();
            this.body = {
                err: false,
                state: true
            }
        } catch (error) {
            this.logger.error(error);
            yield next;
        }
    } else {
        yield next;
    }
}