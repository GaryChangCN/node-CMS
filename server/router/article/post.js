var db = require('../../lib/db');

module.exports = function*(next) {
    if (this.method.toUpperCase() == "POST") {
        try {
            var ctx = this;
            var type = this.request.body.type;
            if(type=="article"){
                var content=ctx.request.body.content;
                var title=ctx.request.body.title;
                var link=ctx.request.body.link;
                var s=new db.Article({
                    content:content,
                    title:title,
                    type:type,
                    link:link,
                    time:new Date()
                });
                yield s.save();
                this.body = {
                    state: true,
                    err: false
                }
            }else{
                yield next;
            }
        } catch (error) {
            this.logger.error(error);
            yield next;
        }
    } else {
        yield next;
    }
}