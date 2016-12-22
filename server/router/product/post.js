var db = require('../../lib/db');

module.exports = function*(next) {
    if (this.method.toUpperCase() == "POST") {
        try {
            var brand = this.request.body.brand;
            var name = this.request.body.name;
            var englishName = this.request.body.englishName;
            var description = this.request.body.description;
            var englishDescription = this.request.body.englishDescription;
            var media = JSON.parse(this.request.body.media);
            var parentId = this.request.body.parent;
            var order = this.request.body.order;
            var number = this.request.body.number;
            var s = new db.Product({
                brand: brand,
                name: name,
                englishName: englishName,
                description: description,
                englishDescription: englishDescription,
                media: media,
                order: order,
                number: number
            });
            var a = yield db.Product.count({ number: number }).exec().then(function(value) {
                if (value > 0) {
                    return false;
                } else {
                    return true;
                }
            }).then(function(value) {
                if (!value) {
                    return false;
                } else {
                    return s.save();
                }
            }).then(function(value) {
                if (parentId) {
                    if (!value) {
                        return false;
                    } else {
                        var productId = value._id;
                        return db.Group.update({ _id: parentId }, { $push: { children: productId.toString() } }).exec().then(function () {
                            return productId;
                        });
                    }
                }else{
                    return value;
                }
            })
            if (!a) {
                this.body = {
                    err: "已存在此编号",
                    state: true
                }
            } else {
                this.body = {
                    err: false,
                    state: true,
                    _id:a._id
                }
            }
        } catch (error) {
            this.logger.error(error);
            yield next;
        }
    } else {
        yield next;
    }
}