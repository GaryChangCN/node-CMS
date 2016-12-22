var db = require('../../lib/db');

module.exports = function*(next) {
    if (this.method.toUpperCase() == "DELETE") {
        try {
            var _id = this.request.body._id;
            var a=yield db.Head.remove({ _id: _id }).exec();
            this.body={
                err:false,
                state:true
            }
        } catch (error) {
            this.logger.error(error);
            yield next;
        }
    } else {
        yield next;
    }
}