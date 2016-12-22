var db = require('../../lib/db');

module.exports = function*(next) {
    try {
        var keywords = this.params.keywords;
        var where=this.params.where;
        var reg = new RegExp(keywords)
        var a = yield db.Order.find({ $and: [{ $or: [{customerCompany:reg},{title:reg},{ customerName: reg }, { customerContact: reg }] }, { where: where }] }).exec();
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