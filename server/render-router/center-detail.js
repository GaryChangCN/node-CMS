var db=require('../lib/db');
module.exports = function*(next) {
    try {
        delete require.cache[require.resolve('./navBar')]
        var navBar=yield require('./navBar');
        var index=this.query.id;
        if(!index){
            throw '缺少index'
        }
        var obj=yield db.Style.findOne({type:'centerarray'},'array').exec().then(function(value){
            if(!value){
                return [];
            }else{
                return value.array;
            }
        })
        obj=obj.map(function(e,index){
            e.channel.index=index;
            return e;
        })
        var chinese=this.query.language?false:true;
        var title=chinese?"新士域保龄球 | 一站式保龄产业供应商":"XSY Bowling Equipment and Parts Supplier";
        var data ={
            indexThis:~~index,
            list:obj,
            navBar,
            chinese,
            title
        }
        this.body = this.render('./view/center-detail', data);
    } catch (error) {
        this.logger.error(error);
        yield next;
    }
}