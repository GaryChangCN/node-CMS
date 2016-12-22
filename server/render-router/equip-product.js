var db = require('../lib/db');
module.exports = function*(next) {
    try {
        var extra=this.query.extra;
        if(!extra){
            throw '不存在'
        }
        delete require.cache[require.resolve('./navBar')]
        var navBar = yield require('./navBar');
        var p = yield db.Group.findOne({ extra: extra }).exec().then(function(value) {
            var children = value.children;
            var tmp = [];
            children.forEach(function(e) {
                tmp.push(db.Product.findOne({ _id: e }).exec().then(function(product){
                    var media=product.media;
                    var tmp2=[];
                    media.forEach(function(e){
                        tmp2.push(db.Media.findOne({_id:e}).exec().then(function(value){
                            return {
                                _id:value._id,
                                alt:value.name,
                                altEn:value.englishName,
                                link:"/api/media/pic/"+value.link
                            }
                        }))
                    });
                    return Promise.all(tmp2).then(function(value){
                        return {
                            name:product.name,
                            _id: product._id,
                            englishName:product.englishName,
                            description:product.description,
                            englishDescription:product.englishDescription,
                            media:value,
                            number:product.number
                        }
                    })
                }));
            });
            return Promise.all(tmp);
        });
        var info=yield db.Group.findOne({ extra: extra }).exec();
        var chinese = this.query.language ? false : true;
        var title = chinese?"新士域保龄球 | 一站式保龄产业供应商":"XSY Bowling Equipment and Parts Supplier";
        var data = {
            navBar,
            chinese,
            title
        }
        data.extra={
            _id:info._id,
            name:info.name,
            englishName:info.englishName,
            extra:extra,
            children:p
        }
        this.body = this.render('./view/equip-product', data);
    } catch (error) {
        this.logger.error(error);
        yield next;
    }
}