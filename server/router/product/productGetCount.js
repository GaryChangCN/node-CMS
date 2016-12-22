var db = require('../../lib/db');

module.exports = function*(next) {
    try {
        var a = yield db.Product.count({}).exec();
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