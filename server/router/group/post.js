var db = require('../../lib/db');

module.exports = function*(next) {
    if (this.method.toUpperCase() == "POST") {
        var stage = this.request.body.stage;
        var name = this.request.body.name;
        var englishName = this.request.body.englishName
        var ctx = this;
        switch (stage) {
            case 'first':
                var s = new db.Group({
                    name: name,
                    englishName: englishName,
                    stage: 'first'
                });
                try {
                    var a = yield s.save().then(function(value){
                        var _id=value._id;
                        return _id.toString();
                    }).then(function(_id){
                        return db.Group.update({stage:'root'},{$push:{children:_id}},{upsert:true}).exec();
                    })
                    ctx.body = {
                        err: false,
                        state: true
                    }
                } catch (error) {
                    ctx.logger.error(error);
                    yield next;
                }
                break;
            case 'second':
                var extra=ctx.request.body.extra||'';
                var s = new db.Group({
                    name,
                    englishName,
                    stage: 'second',
                    extra
                });
                var parentId = ctx.request.body.parent;
                try {
                    var a = yield s.save().then(function(value) {
                        return value;
                    }).then(function(value) {
                        return value._id;
                    }).then(function(_id) {
                        return db.Group.update({
                            _id: parentId
                        }, {
                            $push: {
                                children: _id.toString()
                            }
                        });
                    });
                    ctx.body = {
                        err: false,
                        state: true
                    }
                } catch (error) {
                    ctx.logger.error(error);
                    yield next;
                }
                break;
            case 'third':
                var s = new db.Group({
                    name: name,
                    englishName: englishName,
                    stage: 'third'
                });
                var parentId = ctx.request.body.parent;
                try {
                    var a = yield s.save().then(function(value) {
                        return value;
                    }).then(function(value) {
                        return value._id;
                    }).then(function(_id) {
                        return db.Group.update({
                            _id: parentId
                        }, {
                            $push: {
                                children: _id.toString()
                            }
                        });
                    });
                    ctx.body = {
                        err: false,
                        state: true
                    }
                } catch (error) {
                    ctx.logger.error(error);
                    yield next;
                }
                break;
            case 'product':
                var parentId = ctx.request.body.parent;
                var productId = ctx.request.body.product;
                try {
                    var a = yield db.Group.update({ _id: parentId }, { $push: { children: productId.toString() } }).exec();
                    ctx.body = {
                        err: false,
                        state: true
                    }
                } catch (error) {
                    ctx.logger.error(error);
                    yield next;
                }
                break;
            case 'shelve':
                var parentId = ctx.request.body.parent;
                var productId = ctx.request.body.product;
                try {
                    var a = yield db.Group.update({ _id: parentId }, { $pull: { children: productId.toString() } }).exec();
                    ctx.body = {
                        err: false,
                        state: true
                    }
                } catch (error) {
                    ctx.logger.error(error);
                    yield next;
                }
                break;
            default:
                yield next;
                break;
        }
    } else {
        yield next;
    }
}