var db = require('../../lib/db');

module.exports = function*(next) {
    try {
        var ctx = this;
        var type = this.params.type;
        if(type=="title"){
            var a=yield db.Article.find({type:"article"},'title type time link').exec()
            this.body = {
                state: true,
                err: false,
                list:a
            }
        }else{
            yield next;
        }
    } catch (error) {
        this.logger.error(error);
        yield next;
    }
}