var cry = require('../../lib/cry');

module.exports = function*(next) {
    var c = this.cookies.get('limit');
    if (c) {
        var limit = cry.de(c);
        var json = JSON.parse(limit);
        if (json && json.indexOf(4) > -1) {
            yield next;
        } else {
            this.body = {
                state: false
            }
        }
    } else {
        this.body = {
            state: false
        }
    }
}