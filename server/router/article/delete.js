var db = require('../../lib/db');

module.exports = function*(next) {
    if (this.method.toUpperCase() == "DELETE") {
        try {
            var ctx = this;
            var _id = this.request.body._id;
            var a=yield db.Article.findOne({type:'category'}).exec().then(function(value){
                var array=value.array.map(function(e){
                    var tmp=e.children||[];
                    e.children=tmp.filter(function(f){
                        if(f!=_id){
                            return true;
                        }
                    });
                    return e;
                });
                return array;
            }).then(function(array){
                return db.Article.update({type:'category'},{$set:{array:array}}).exec();
            }).then(function(){
                return db.Article.remove({_id:_id}).exec();
            });
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