var db = require('../../lib/db');

module.exports = function*(next) {
    if (this.method.toUpperCase() == "POST") {
        try {
            var ctx = this;
            var type = this.request.body.type;
            var array = JSON.parse(ctx.request.body.array);
            var data = {
                type: type,
                array: array
            }
            var a=yield db.Style.update({ type: type }, data,{upsert:true});
            this.body = {
                    state: true,
                    err: false
            }
        } catch (error) {
            this.logger.error(error);
            yield next;
        }
    } else {
        yield next;
    }
}