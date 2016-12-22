var db = require('../../lib/db');
var fs = require('fs');
var path = require('path');
module.exports = function*(next) {
    if (this.method.toUpperCase() == "PUT") {
        try {
            var _id = this.request.body._id;
            var change=JSON.parse(this.request.body.change);
            var a=yield db.Media.update({_id,_id},{$set:change}).exec();
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