var db = require('../../lib/db');

module.exports = function*(next) {
    if (this.method.toUpperCase() == "GET") {
        try {
            var ctx = this;
            var type = this.params.type;
            var a = yield db.Style.findOne({ type: type });
            var res = {};
            res[type] = a ? a.array : [];
            this.body = res;
        } catch (error) {
            this.logger.error(error);
            yield next;
        }
    } else {
        yield next;
    }
}