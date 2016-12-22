var db = require('../lib/db');
module.exports = function*(next) {
    try {
        delete require.cache[require.resolve('./navBar')]
        var navBar = yield require('./navBar');
        var _id=this.query._id;
        if(!_id){
            throw '未知_id';
        }
        var data=yield db.Style.findOne({type:"equipmentdetail"},'array').exec().then(function(value){
            if(!value){
                return [];
            }else{
                return value.array[0];
            }
        });
        var info=yield db.Product.findOne({ _id: _id },'name englishName number').exec();
        var chinese = this.query.language ? false : true;
        var title = chinese?"新士域保龄球 | 一站式保龄产业供应商":"XSY Bowling Equipment and Parts Supplier";
        var data = {
            info,
            data:data[_id],
            navBar: navBar,
            chinese,
            title
        }
        this.body = this.render('./view/equipment-detail', data);
    } catch (error) {
        this.logger.error(error);
        yield next;
    }
}