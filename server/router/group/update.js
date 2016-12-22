var db = require('../../lib/db');

module.exports = function*(next) {
    if (this.method.toUpperCase() == "PUT") {
        var ctx=this;
        var _id=this.request.body._id;
        try {
            var change=JSON.parse(this.request.body.change);
            var a=yield db.Group.update({ _id: _id }, { $set: change }).exec();
            ctx.body={
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