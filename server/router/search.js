var db = require('../lib/db');

module.exports = function*(next) {
    try {
        var keywords = this.query.keywords;
        var reg = new RegExp(keywords)
        var a = yield db.Product.find({ $or: [{ number: reg }, { name: reg }, { englishName: reg }, { brand: reg }] }).exec().then(function(productList) {
            var tmp = [];
            productList.forEach(function(e) {
                var tmp2 = [];
                var media = e.media;
                media.forEach(function(e) {
                    tmp2.push(db.Media.findOne({ _id: e }).exec().then(function(value) {
                        return {
                            link: '/api/media/pic/' + value.link,
                            alt: value.name,
                            altEn: value.englishName,
                            _id:value._id
                        }
                    }));
                });
                tmp.push(Promise.all(tmp2).then(function(value) {
                    return {
                        _id: e._id,
                        name: e.name,
                        englishName: e.englishName,
                        description: e.englishDescription,
                        number: e.number,
                        type: e.type,
                        media: value
                    }
                }));
            });
            return Promise.all(tmp);
        })
        var b = yield db.Article.find({ $and: [{ type: 'article' }, { $or: [{ title: reg }, { content: reg }] }] }, 'link time title content').exec();
        this.body = {
            productList: a,
            articleList: b
        }
    } catch (error) {
        this.logger.error(error);
        yield next;
    }
}