var db=require('../lib/db');
module.exports = function*(next) {
    try {
        delete require.cache[require.resolve('./navBar')]
        var navBar=yield require('./navBar');
        var supportBanner=yield db.Style.findOne({type:'supportBanner'}).exec().then(function(value){
            if(!value){
                return {};
            }else{
                return value;
            }
        });
        var kind=yield db.Article.findOne({type:'category'},'array').exec().then(function(value){
            var t=[]
            value.array.forEach(function(e){
                var tmp=[];
                var arr=e.children||[];
                arr.forEach(function(v){
                    tmp.push(db.Article.findOne({_id:v},'title time').exec());
                });
                t.push(Promise.all(tmp).then(function(v){
                    return {
                        name:e.title,
                        englishName:e.titleEn,
                        children:v
                    };
                }));
            })
            return Promise.all(t);
        });
        var chinese=this.query.language?false:true;
        var title=chinese?"新士域保龄球 | 一站式保龄产业供应商":"XSY Bowling Equipment and Parts Supplier";
        var data ={
            supportBanner,
            kind,
            navBar,
            chinese,
            title
        }
        this.body = this.render('./view/library', data);
    } catch (error) {
        this.logger.error(error);
        yield next;
    }
}