var db = require('../../lib/db');

module.exports = function*(next) {
    if (this.method.toUpperCase() == "POST") {
        try {
            var customerName = this.request.body.customerName;
            var customerContact = this.request.body.customerContact;
            var customerProduct = JSON.parse(this.request.body.customerProduct);
            var customerBoard = this.request.body.customerBoard;
            var money = this.request.body.money;
            var t = customerProduct.map(function(e, index) {
                return {
                    price: 0,
                    singleSum: 0,
                    count: e.count,
                    productId: e._id
                };
            });
            var s = new db.Order({
                customerName: customerName,
                customerContact: customerContact,
                customerProduct: t,
                customerBoard: customerBoard,
                money: money
            });
            var a = yield s.save();
            this.body = {
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