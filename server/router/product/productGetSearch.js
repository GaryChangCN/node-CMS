var db = require('../../lib/db');

module.exports = function*(next) {
    try {
        var keywords = this.params.keywords;
        var reg = new RegExp(keywords)
        var a = yield db.Product.find({ $or: [{ number: reg }, { name: reg }, { englishName: reg }, { brand: reg }] }).exec();
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