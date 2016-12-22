var db = require('../../lib/db');

module.exports = function*(next) {
    if (this.method.toUpperCase() == "PUT") {
        var _id = this.request.body._id;
        try {
            var change=JSON.parse(this.request.body.change);
            var a=yield db.Order.update({ _id: _id }, { $set: change }).exec();
            this.body={
                err:false,
                state:true
            }
        } catch (error) {
            this.logger.error(error);
            yield next;
        }
    }else{
        yield next;
    }
}