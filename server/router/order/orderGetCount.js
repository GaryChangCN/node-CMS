var db = require('../../lib/db');

module.exports = function*(next) {
    try {
        var type=this.params.type;
        var a = yield db.Order.count({where: type}).exec();
        this.body = {
            err: false,
            state: true,
            count: a
        }
    } catch (error) {
        this.logger.error(error);
        yield next;
    }

}