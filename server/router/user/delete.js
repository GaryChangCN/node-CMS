var db = require('../../lib/db');

module.exports = function*(next) {
    if (this.method.toUpperCase() == "DELETE") {
        try {
            var _id = this.request.body._id;
            var a=yield db.Admin.findOne({ _id:_id }).exec().then(function(value){
                return value;
            }).then(function(value){
                if(value.superUser){
                    return false;
                }else{
                    return db.Admin.remove({ _id: _id }).exec();
                }
            });
            if(a){
                this.body={err:false,state:true}
            }else{
                this.body={ err: 'cannot delete superUser', state: true };
            }
        } catch (error) {
            this.logger.error(error);
            yield next;
        }
    } else {
        yield next;
    }
}