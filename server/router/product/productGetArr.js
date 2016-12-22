var db = require('../../lib/db');

module.exports = function*(next) {
    try {
        var arr = JSON.parse(this.request.body.arr);
        var tmp=[];
        arr.forEach(function(e){
            tmp.push(db.Product.findOne({_id:e},'name englishName number media').exec().then(function(value){
                var tmp2=[];
                value.media.forEach(function(e){
                    tmp2.push(db.Media.findOne({_id:e}).exec().then(function(value){
                        return {
                            link:"/api/media/pic/"+value.link,
                            alt:value.name,
                            altEn:value.englishName
                        }
                    }))
                });
                return Promise.all(tmp2).then(function(v){
                    return {
                        name:value.name,
                        _id: value._id,
                        englishName:value.englishName,
                        number:value.number,
                        media:v
                    }
                });
            }));
        });
        var a=yield Promise.all(tmp);
        this.body = {
            list: a
        }
    } catch (error) {
        this.logger.error(error);
        yield next;
    }
}