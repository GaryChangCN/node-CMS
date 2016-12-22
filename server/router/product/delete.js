var db = require('../../lib/db');

module.exports = function*(next) {
    if (this.method.toUpperCase() == "DELETE") {
        try {
            var _id = this.request.body._id;
            yield db.Product.remove({ _id: _id }).exec();
            yield db.Group.update({}, { $pull: { children: _id.toString() } }, { multi: true }).exec();
            this.body = {
                err: false,
                state: true
            }
        } catch (error) {
            this.logger.error(error);
            yield next;
        }
    } else {
        yield next;
    }
}