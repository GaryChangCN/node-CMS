var db = require('../../lib/db');

module.exports = function*(next) {
    try {
        var ctx = this;
        var _id = this.params._id;
        var a=yield db.Article.findOne({_id:_id},'title type time content link').exec()
        this.body = {
            state: true,
            err: false,
            data:a
        }
    } catch (error) {
        this.logger.error(error);
        yield next;
    }
}