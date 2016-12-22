var db = require('../lib/db');
module.exports = function*(next) {
    try {
        delete require.cache[require.resolve('./navBar')]
        var navBar = yield require('./navBar');
        var pinsetler = yield db.Group.findOne({ extra: 'pinsetler' }).exec().then(function(value) {
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
                            _id:product._id,
                            name:product.name,
                            englishName:product.englishName,
                            description:product.description,
                            englishDescription:product.englishDescription,
                            media:value
                        }
                    })
                }));
            });
            return Promise.all(tmp);
        });
        var info=yield db.Group.findOne({ extra: 'pinsetler' }).exec();
        var chinese = this.query.language ? false : true;
        var title =chinese?"新士域保龄球 | 一站式保龄产业供应商":"XSY Bowling Equipment and Parts Supplier";
        var data = {
            pinsetler:{
                _id:info._id,
                name:info.name,
                englishName:info.englishName,
                children:pinsetler
            },
            navBar: navBar,
            chinese,
            title
        }
        this.body = this.render('./view/equipment-list', data);
    } catch (error) {
        this.logger.error(error);
        yield next;
    }
}