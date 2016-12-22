var db = require('../../lib/db');
var fs = require('fs');
var path = require('path');
module.exports = function*(next) {
    if (this.method.toUpperCase() == "DELETE") {
        try {
            var _id = this.request.body._id;
            var a=yield db.Media.remove({_id,_id}).exec();
            this.body = {
                state: true,
                err: false,
                a
            }
        } catch (error) {
            this.logger.error(error);
            yield next;
        }
    } else {
        yield next;
    }

}