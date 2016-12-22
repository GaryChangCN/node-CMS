var db = require('../../lib/db');

module.exports = function*(next) {
    if (this.method.toUpperCase() == "DELETE") {
        try {
            var _id = this.request.body._id;
            var a = yield db.Order.findOne({ _id: _id }).exec().then(function(value) {
                return value;
            }).then(function(value) {
                if (value.where != "recycle") {
                    return false;
                } else {
                    return db.Order.remove({ _id: _id }).exec();
                }
            });
            if (a) {
                this.body = {
                    err: false,
                    state: true
                }
            } else {
                this.body = {
                    err: "cannot delete order which is not in recycle",
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