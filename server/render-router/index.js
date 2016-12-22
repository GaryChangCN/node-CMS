var db=require('../lib/db');
module.exports = function*(next) {
    try {
        delete require.cache[require.resolve('./navBar')]
        var navBar=yield require('./navBar');
        var rotation=yield db.Style.findOne({type:'rotation'}).exec().then(function(value){
            if(!value){
                return [];
            }else{
                return value.array;
            }
        });
        var rotationMobile=yield db.Style.findOne({type:'rotationMobile'}).exec().then(function(value){
            if(!value){
                return [];
            }else{
                return value.array;
            }
        });
        var investors=yield db.Style.findOne({type:'investors'}).exec().then(function(value){
            if(!value){
                return [];
            }else{
                return value.array;
            }
        })
        var centers=yield db.Style.findOne({type:'centers'}).exec().then(function(value){
            if(!value){
                return [];
            }else{
                return value.array;
            }
        })
        var bowlers=yield db.Style.findOne({type:'bowlers'}).exec().then(function(value){
            if(!value){
                return [];
            }else{
                return value.array;
            }
        });
        var chinese=this.query.language?false:true;
        var title=chinese?"新士域保龄球 | 一站式保龄产业供应商":"XSY Bowling Equipment and Parts Supplier";
        var _this=this;
        var linkTarget=function(arr){
            return arr.map(function(e){
                var target=e.target||"//"+_this.request.hostname+"/index.html";
                var language=chinese?"":"language=en";
                if(target.indexOf("?")>=0){
                    var newTarget=target+"&"+language;
                }else{
                    var tmp=chinese?"":"?"+language
                    var newTarget=target+tmp;
                }
                e.target=newTarget;
                return e;
            })
        };
        var data={
            navBar:navBar,
            rotation:rotation,
            rotationMobile:rotationMobile,
            investors:linkTarget(investors),
            centers:linkTarget(centers),
            bowlers:linkTarget(bowlers),
            chinese,
            title
        }
        this.body = this.render('./view/index', data);
    } catch (error) {
        this.logger.error(error);
        yield next;
    }
}