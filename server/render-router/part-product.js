var db = require('../lib/db');
module.exports = function*(next) {
    try {
        var second = this.query.second;
        if (!second) {
            throw '不存在'
        }
        delete require.cache[require.resolve('./navBar')]
        var navBar = yield require('./navBar');
        var first = yield db.Group.findOne({children:{$in:[second]}},'name englishName type').exec();
        var secondInfo = yield db.Group.findOne({ _id: second },'name englishName children type').exec();
        var isGroup = yield db.Group.count({ _id: secondInfo.children[0] }).exec().then(function(value) {
            if (value > 0) {
                return true;
            } else {
                return false;
            }
        })
        if (isGroup) {
            var children = secondInfo.children;
            var tmp = [];
            children.forEach(function(e) {
                tmp.push(db.Group.findOne({_id:e}).exec().then(function(third){
                    var tmp2=[];
                    third.children.forEach(function(v){
                        tmp2.push(db.Product.findOne({_id:v}).exec().then(function(fourth){
                            var tmp3=[];
                            fourth.media.forEach(function(e){
                                tmp3.push(db.Media.findOne({_id:e}).exec().then(function(value){
                                    return {
                                        alt:value.name,
                                        altEn:value.englishName,
                                        link:"/api/media/pic/"+value.link,
                                        _id:value._id
                                    }
                                }));
                            });
                            return Promise.all(tmp3).then(function(value){
                                return {
                                    _id:fourth._id,
                                    name:fourth.name,
                                    type:fourth.type,
                                    englishName:fourth.englishName,
                                    description:fourth.description,
                                    number:fourth.number,
                                    englishDescription:fourth.englishDescription,
                                    media:value
                                }
                            });
                        }));
                    });
                    return Promise.all(tmp2).then(function(value){
                        return {
                            type:third.type,
                            name:third.name,
                            englishName:third.englishName,
                            _id:third._id,
                            children:value
                        }
                    });
                }))
            })
            var p=yield Promise.all(tmp);
        }else{
            var children = secondInfo.children;
            var tmp = [];
            children.forEach(function(e){
                tmp.push(db.Product.findOne({_id:e}).exec().then(function(product){
                    var tmp2=[];
                    product.media.forEach(function(e){
                        tmp2.push(db.Media.findOne({_id:e}).exec().then(function(value){
                            return {
                                alt:value.name,
                                altEn:value.englishName,
                                link:"/api/media/pic/"+value.link,
                                _id:value._id
                            }
                         }));
                    })
                    return Promise.all(tmp2).then(function(value){
                        return {
                            _id:product._id,
                            name:product.name,
                            type:product.type,
                            number:product.number,
                            englishName:product.englishName,
                            description:product.description,
                            englishDescription:product.englishDescription,
                            media:value
                        }
                    });
                }));
            });
            var p=yield Promise.all(tmp);
        }
        var chinese = this.query.language ? false : true;
        var title = chinese?"新士域保龄球 | 一站式保龄产业供应商":"XSY Bowling Equipment and Parts Supplier";
        var data = {
            first,
            second:secondInfo,
            third:p,
            navBar: navBar,
            chinese,
            title
        }
        this.body = this.render('./view/part-product', data);
    } catch (error) {
        this.logger.error(error);
        yield next;
    }
}