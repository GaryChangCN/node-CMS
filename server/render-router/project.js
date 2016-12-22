var db=require('../lib/db');
module.exports = function*(next) {
    try {
        delete require.cache[require.resolve('./navBar')]
        var navBar=yield require('./navBar');
        var projectBanner=yield db.Style.findOne({type:'projectBanner'}).exec().then(function(value){
            if(!value){
                return [];
            }else{
                return value.array;
            }
        });
        var projectList=yield db.Style.findOne({type:'projectList'}).exec().then(function(value){
            if(!value){
                return [];
            }else{
                return value.array;
            }
        });
        var chinese=this.query.language?false:true;
        var title=chinese?"新士域保龄球 | 一站式保龄产业供应商":"XSY Bowling Equipment and Parts Supplier";
        var data={
            projectBanner:projectBanner,
            projectList:projectList,
            navBar:navBar,
            chinese,
            title
        }
        // this.body = data;
        this.body = this.render('./view/project', data);
    } catch (error) {
        this.logger.error(error);
        yield next;
    }
}