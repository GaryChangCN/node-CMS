var db = require('../../lib/db');

module.exports = function*(next) {
    try {
        var limit = ~~this.params.limit;
        var skip = ~~this.params.skip;
        var a = yield db.Product.find({}).sort({ _id: -1 }).limit(limit).skip(skip).exec();
        this.body = {
            err: false,
            state: true,
            list: a
        }
    } catch (error) {
        this.logger.error(error);
        yield next;
    }
}