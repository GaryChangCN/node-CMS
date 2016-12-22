var db = require('../../lib/db');

module.exports = function*(next) {
    try {
        var type=this.params.type;
        var limit = ~~this.params.limit;
        var skip = ~~this.params.skip;
        var a = yield db.Order.find({where: type}).sort({ _id: -1 }).limit(limit).skip(skip).exec();
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