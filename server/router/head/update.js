var db = require('../../lib/db');

module.exports = function*(next) {
    if (this.method.toUpperCase() == "PUT") {
        try {
            var _id = this.request.body._id;
            var change = JSON.parse(this.request.body.change);
            var a= yield db.Head.update({ _id: _id }, { $set: change });
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