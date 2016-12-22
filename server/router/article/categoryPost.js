var db = require('../../lib/db');

module.exports = function*(next) {
    if (this.method.toUpperCase() == "POST") {
        try {
            var ctx = this;
            var type = this.request.body.type;
            if (type == "category") {
                var array = JSON.parse(ctx.request.body.array);
                var data = {
                    type: type,
                    array: array
                }
                yield db.Article.update({ type: type }, data, { upsert: true });
                this.body = {
                    state: true,
                    err: false
                }
            } else {
                yield next;
            }
        } catch (error) {
            this.logger.error(error);
            yield next;
        }
    } else {
        yield next;
    }
}