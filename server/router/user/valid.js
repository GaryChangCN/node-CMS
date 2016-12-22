var cry = require('../../lib/cry');

module.exports = function*(next) {
    var c = this.cookies.get('limit');
    var superMe=this.cookies.get('superMe');
    if (c&&superMe) {
        var limit = cry.de(c);
        var s =cry.de(superMe).split("#")[0];
        var json = JSON.parse(limit);
        if (json && json.indexOf(4) > -1 && s=="yes") {
            yield next;
        } else {
            this.body = {
                err:true,
                state: false
            }
        }
    } else {
        this.body = {
            err:true,
            state: false
        }
    }
}