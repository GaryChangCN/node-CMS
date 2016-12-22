var db = require('../../lib/db');

module.exports = function*(next) {
    if (this.method.toUpperCase() == "POST") {
        try {
            var name = this.request.body.name;
            var address = this.request.body.address;
            var contact = this.request.body.contact;
            var s = new db.Head({
                name: name,
                address: address,
                contact: contact
            });
            var a = yield s.save();
            this.body = { err: false, state: true };
        } catch (error) {
            this.logger.error(error);
            yield next;
        }
    } else {
        yield next;
    }
}