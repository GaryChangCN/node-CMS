var db = require('../../lib/db');

module.exports = function*(next) {
    if (this.method.toUpperCase() == "DELETE") {
        var ctx = this;
        var stage = this.request.body.stage;
        var _id = this.request.body._id;
        try {
            switch (stage) {
                case 'first':
                    var sum = [_id];
                    var a = yield db.Group.findOne({ _id: _id }).exec().then(function(value) {
                        return value.children;
                    }).then(function(value) {
                        var tmp = [];
                        value.forEach(function(e) {
                            sum.push(e);
                            tmp.push(db.Group.findOne({ _id: e }).exec().then(function(doc) {
                                return doc.children;
                            }));
                        });
                        return Promise.all(tmp);
                    }).then(function(value) {
                        var list = Array.prototype.concat.apply([], value);
                        list.forEach(function(e) {
                            sum.push(e);
                        });
                        var tmp = [];
                        sum.forEach(function(e) {
                            tmp.push(db.Group.remove({ _id: e }));
                        });
                        return Promise.all(tmp);
                    })
                    // .then(function(){
                    //     return db.Group.update({stage:'root'},{$pull:{children:_id}}).exec();
                    // })
                    yield db.Group.update({stage:'root'},{$pull:{children:_id}}).exec();
                    ctx.body = {
                        err: false,
                        state: true
                    };
                    break;
                case 'second':
                    var parent_id = this.request.body.parent;
                    var tmp = [];
                    var a = yield db.Group.findOne({ _id: _id }).exec().then(function(value) {
                        tmp.push(db.Group.update({ _id: parent_id }, { $pull: { children: _id } }).exec());
                        return value.children;
                    }).then(function(value) {
                        value.forEach(function(e) {
                            tmp.push(db.Group.remove({ _id: e }).exec());
                        });
                        tmp.push(db.Group.remove({ _id: _id }).exec());
                        return Promise.all(tmp);
                    });
                    ctx.body = {
                        err: false,
                        state: true
                    }
                    break;
                case 'third':
                    var parent_id = this.request.body.parent;
                    var a = yield Promise.all([db.Group.remove({ _id: _id }).exec(), db.Group.update({ _id: parent_id }, { $pull: { children: _id } }).exec()]);
                    ctx.body = {
                        err: false,
                        state: true
                    }
                    break;   
                default:
                    res.json({ err: '未知的stage值', stage: true });
                    break;
            }
        } catch (error) {
            this.logger.error(error);
            yield next;
        }
    } else {
        yield next;
    }
}