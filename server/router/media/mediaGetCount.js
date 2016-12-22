var db = require('../../lib/db');

module.exports = function*(next) {
    try {
        var kind=this.params.kind;
        var a = yield db.Media.count({type: kind}).exec();
        this.body = {
            err: false,
            state: true,
            sum: a
        }
    } catch (error) {
        this.logger.error(error);
        yield next;
    }

}