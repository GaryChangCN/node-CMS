var db = require('../../lib/db');

module.exports = function*(next) {
    try {
        var keywords = this.params.keywords;
        var reg = new RegExp(keywords)
        var a = yield db.Media.find({ $or: [{ name: reg }, { englishName: reg }]}).exec();
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