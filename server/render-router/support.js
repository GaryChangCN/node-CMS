var db=require('../lib/db');
module.exports = function*(next) {
    try {
        delete require.cache[require.resolve('./navBar')]
        var navBar=yield require('./navBar');
        var supportBanner=yield db.Style.findOne({type:'supportBanner'}).exec().then(function(value){
            if(!value){
                return [];
            }else{
                return value.array;
            }
        });
        var tech=yield db.Article.findOne({type:'category'}).exec().then(function(value){
            if(!value){
                return [];
            }else{
                return value.array;
            }
        });

        var chinese=this.query.language?false:true;
        var title=chinese?"新士域保龄球 | 一站式保龄产业供应商":"XSY Bowling Equipment and Parts Supplier";

        var data ={
            supportBanner:supportBanner,
            tech:tech,
            navBar,
            chinese,
            title
        }
        this.body = this.render('./view/support', data);
        //this.body=this.render('test',{test:a});
    } catch (error) {
        this.logger.error(error);
        yield next;
    }
}