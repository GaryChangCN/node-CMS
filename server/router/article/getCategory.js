var db = require('../../lib/db');

module.exports = function*(next) {
    try {
        var ctx = this;
        var type = this.params.type;
        if(type=="all"){
            var a=yield db.Article.findOne({type:'category'}).exec();
            this.body = {
                state: true,
                err: false,
                type:a?a.type:'category',
                list:a?a.array:[]
            }
        }else{
            yield next;
        }
    } catch (error) {
        this.logger.error(error);
        yield next;
    }
}