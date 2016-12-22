var db=require('../lib/db');
module.exports = function*(next) {
    try {
        delete require.cache[require.resolve('./navBar')]
        var navBar=yield require('./navBar');
        var centerBanner=yield db.Style.findOne({type:'centerBanner'}).exec().then(function(value){
            if(!value){
                return {}
            }else if(!value.array){
                return {};
            }else{
                return value.array[0];
            }
        })
        var channel=yield db.Style.findOne({type:'centerarray'},'array').exec().then(function(value){
            if(!value){
                return [];
            }else{
                return value.array.map(function(e,index){
                    e.channel.index=index;
                    return e.channel;
                })
            }
        });
        var chinese=this.query.language?false:true;
        var title=chinese?"新士域保龄球 | 一站式保龄产业供应商":"XSY Bowling Equipment and Parts Supplier";
        var data = {
            navBar,
            centerBanner,
            channel,
            chinese,
            title
        }
        this.body = this.render('./view/center', data);
    } catch (error) {
        this.logger.error(error);
        yield next;
    }
}