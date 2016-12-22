var db=require('../lib/db');
module.exports = function*(next) {
    try {
        delete require.cache[require.resolve('./navBar')]
        var navBar=yield require('./navBar');
        var _id=this.query._id;
        if(_id){
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
            var a=yield db.Article.findOne({_id:_id},'title time content link').exec();
            var chinese=this.query.language?false:true;
            var data ={
                kind: kind,
                title:a.title,
                time:a.time,
                content:a.content,
                _id:a._id,
                link:a.link,
                chinese,
                navBar
            }
            this.body = this.render('./view/article', data);
        }else{
            yield next;
        }
    } catch (error) {
        this.logger.error(error);
        yield next;
    }
}