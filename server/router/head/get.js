var db = require('../../lib/db');

module.exports = function*(next) {
    if (this.method.toUpperCase() == "GET") {
        try {
            var a=yield db.Head.find({}).exec();
            this.body={
                err:false,state:true,
                list:a
            }
        } catch (error) {
            this.logger.error(error);
            yield next;
        }
    } else {
        yield next;
    }
}