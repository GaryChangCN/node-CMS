var db = require('../../lib/db');

module.exports = function*(next) {
    if (this.method.toUpperCase() == "GET") {
        try {
            var a=yield db.Admin.find({},'_id username limit superUser').exec();
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